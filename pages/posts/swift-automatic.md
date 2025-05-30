---
title: Swift原子化实现方式的讨论
date: 2025-03-22
updated: 2025-03-22
categories: Swift 笔记
tags:
  - Swift
  - 笔记
top: 1
---

下面整理了一份关于 Swift 编程中如何实现原子化（atomic）的文档，从原子操作的基本概念讲起，然后介绍在 Swift 中可采用的几种常见实现方式及示例代码，供大家参考和学习。

---

**Swift 中的原子化实现方式探讨**

  

在多线程和并发编程中，“原子性”是确保数据访问和修改过程不被其他线程干扰的关键特性。虽然 Swift 标准库中没有提供直接的原子变量类型，但我们可以通过多种方式来实现原子操作。本文将介绍以下几种方法：

1. **使用串行队列（DispatchQueue）**

2. **使用锁（NSLock）**

3. **使用属性包装器（Property Wrapper）**

4. **利用 Dispatch Barrier 优化并发访问**

5. **利用 Actor 模型进行状态隔离（Swift 5.5+）**

6. **传统的 C/C++ 原子操作方法（如 OSAtomic，但已过时）**

---

## **1. 什么是原子性**

  

原子操作指的是一个不可分割的操作序列，要么全部执行完毕，要么完全没有执行。这样可以防止在多线程环境下出现数据竞争（race condition）或数据不一致的问题。常见的应用场景包括计数器、自增/自减操作以及需要对共享资源进行读写的情况。

---

## **2. 为什么需要原子操作**

  

在并发环境下，如果多个线程同时读取和写入某个变量而没有同步机制，会导致数据状态混乱、数据竞争甚至崩溃。通过采用原子化操作，可以确保一个线程在对共享数据进行更新时，其他线程不会在中途读取到不完整的数据状态，从而有效提高程序的健壮性和安全性。

---

## **3. 常见的原子操作实现方式**

  

### **3.1 使用串行队列（DispatchQueue）**

  

利用串行队列可以确保访问共享资源的操作按照先后顺序执行。示例代码如下：

``` swift
class AtomicInt {
    private let queue = DispatchQueue(label: "com.example.atomicInt")
    private var _value: Int = 0

    var value: Int {
        get {
            return queue.sync { _value }
        }
        set {
            queue.sync { _value = newValue }
        }
    }

    func increment() {
        queue.sync { _value += 1 }
    }
}

let atomicInt = AtomicInt()
atomicInt.increment()
print("Atomic value is \(atomicInt.value)")
```

在以上示例中，每次访问 _value 都是通过 queue.sync 完成的，从而确保访问的原子性。

---

### **3.2 使用 NSLock**

  

NSLock 为我们提供了一个简单的锁机制，通过在读写操作前加锁、操作完成后解锁来确保线程安全。示例代码如下：

``` swift
class AtomicIntWithLock {
    private var _value: Int = 0
    private let lock = NSLock()

    var value: Int {
        get {
            lock.lock()
            defer { lock.unlock() }
            return _value
        }
        set {
            lock.lock()
            _value = newValue
            lock.unlock()
        }
    }

    func increment() {
        lock.lock()
        _value += 1
        lock.unlock()
    }
}

let atomicIntLock = AtomicIntWithLock()
atomicIntLock.increment()
print("Atomic value with lock is \(atomicIntLock.value)")
```

使用 NSLock 可以较为直接地控制代码的互斥执行。

---

### **3.3 使用属性包装器（Property Wrapper）**

  

Swift 5.1 之后引入的属性包装器使得封装原子操作变得更加直观。我们可以将同步逻辑抽象到属性包装器中，这样使用时只需在变量声明时加上包装器即可：

``` swift
@propertyWrapper
struct Atomic<Value> {
    private var value: Value
    private let queue = DispatchQueue(label: "com.example.atomicProperty")

    init(wrappedValue: Value) {
        self.value = wrappedValue
    }

    var wrappedValue: Value {
        get {
            queue.sync { value }
        }
        set {
            queue.sync { value = newValue }
        }
    }
}

class SomeClass {
    @Atomic var counter: Int = 0

    func increment() {
        counter += 1
    }
}

let obj = SomeClass()
obj.increment()
print("Atomic property counter: \(obj.counter)")
```

这种方式不仅代码更简洁，而且能很方便地复用于不同数据类型。

---

### **3.4 使用 Dispatch Barrier 优化并发访问**

  

如果需要在并发队列中对资源进行读写操作，可以采用 Dispatch Barrier 来确保写操作的原子性，同时允许多个并发读操作，从而提高性能。例如：

``` swift
class AtomicArray<Element> {
    private var array: [Element] = []
    private let concurrentQueue = DispatchQueue(label: "com.example.atomicArray", attributes: .concurrent)

    var elements: [Element] {
        return concurrentQueue.sync { array }
    }

    func append(_ element: Element) {
        concurrentQueue.async(flags: .barrier) {
            self.array.append(element)
        }
    }
}

let atomicArray = AtomicArray<Int>()
atomicArray.append(1)
atomicArray.append(2)
DispatchQueue.global().async {
    print("Array elements: \(atomicArray.elements)")
}
```

这里使用 async(flags: .barrier) 保证写操作时其他读写任务不会并发执行，从而实现数据的一致性维护。

---

### **3.5 利用 Actor 模型（Swift Concurrency）**

  

从 Swift 5.5 开始，Swift 引入了 Actor 概念，通过将状态封装在 actor 内部，就能保证对内部状态的访问都是串行的，从而实现天然的线程安全。例如：

```swift
actor AtomicCounter {
    private var value: Int = 0

    func increment() {
        value += 1
    }

    func getValue() -> Int {
        return value
    }
}

// 使用 Actor
let counter = AtomicCounter()

Task {
    await counter.increment()
    let currentValue = await counter.getValue()
    print("Actor atomic counter: \(currentValue)")
}
```

Actor 模型不仅语法简洁，而且与 Swift 的并发特性相结合，非常适合编写线程安全的代码。

---

### **3.6 传统的 C/C++ 原子操作**

  

在 Swift 中，曾经可以通过调用 libkern 提供的一些 C 库函数（如 OSAtomic）来实现原子操作，但这些 API 已被标记为过时并不推荐使用。在需要极致性能和底层操作时，可考虑引入 C++ 中的 std::atomic，或者依赖第三方库封装。但由于 Swift 本身提倡更高级的并发抽象，因此推荐优先考虑 GCD、NSLock 或 Actor 模型等方式。

---

## **4. 性能与适用场景分析**

• **串行队列**：实现简单，但在高并发场景下可能导致串行瓶颈。适合数据量不大或对性能要求不苛刻的场景。

• **NSLock**：互斥锁实现原子性，开销较小，但需谨防死锁问题，使用时注意锁的正确释放。

• **属性包装器**：封装性好，便于复用与维护。适合封装常用的简单数据类型。

• **Dispatch Barrier**：在读多写少的场景中可以发挥优势，既保证写操作的原子性，又允许并行读操作。

• **Actor 模型**：适用于 Swift 并发环境下的状态管理，能够充分利用异步特性，实现代码简洁的同时保持线程安全。

选择哪种实现方式往往要根据具体需求、并发量以及代码的复杂度做出权衡。

---

## **5. 总结**

在 Swift 编程中，实现原子化操作主要依赖于任务调度和同步控制机制。本文介绍了通过串行队列、锁、属性包装器、Dispatch Barrier 以及 Actor 模型等方式来实现原子操作的不同方法。开发者可以根据项目的实际情况选择合适的方法，既保证线程安全又能兼顾性能。
