---
title: Swift iOS文件操作
date: 2023-05-14
updated: 2023-05-14
categories: Swift 笔记
tags:
  - Swift
  - 笔记
top: 1
excerpt: ""
excerptAlign: left
---

在Swift中，可以使用`FileManager`类来处理文件路径和文件操作。

1. **获取文件目录路径**:
   使用`FileManager.default.urls(for:in:)`方法来获取不同类型的文件目录路径，如应用程序文档目录、缓存目录等。

   ```swift
   // 获取文档目录路径
   let documentDirectoryURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]

   // 获取缓存目录路径
   let cacheDirectoryURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
   ```

2. **拼接文件路径**:
   使用`appendingPathComponent(_:)`方法来拼接文件名到目录路径。

   ```swift
   let fileName = "example.txt"
   let fileURL = documentDirectoryURL.appendingPathComponent(fileName)
   ```

3. **检查文件是否存在**:
   使用`fileExists(atPath:)`方法来检查文件是否存在于指定路径。

   ```swift
   let fileExists = FileManager.default.fileExists(atPath: fileURL.path)
   ```

4. **创建文件夹**:
   使用`createDirectory(at:withIntermediateDirectories:attributes:)`方法来创建文件夹。第二个参数表示是否自动创建中间目录。

   ```swift
   let folderURL = documentDirectoryURL.appendingPathComponent("MyFolder")
   do {
       try FileManager.default.createDirectory(at: folderURL, withIntermediateDirectories: true, attributes: nil)
   } catch {
       print(error)
   }
   ```

5. **删除文件或文件夹**:
   使用`removeItem(at:)`方法来删除文件或文件夹。注意：删除文件夹时，文件夹必须为空。

   ```swift
   do {
       try FileManager.default.removeItem(at: fileURL)
   } catch {
       print(error)
   }
   ```

6. **移动文件或文件夹**:
   使用`moveItem(at:to:)`方法来移动文件或文件夹到指定路径。

   ```swift
   let newFileURL = cacheDirectoryURL.appendingPathComponent("example.txt")
   do {
       try FileManager.default.moveItem(at: fileURL, to: newFileURL)
   } catch {
       print(error)
   }
   ```

7. **复制文件或文件夹**:
   使用`copyItem(at:to:)`方法来复制文件或文件夹到指定路径。

   ```swift
   let copyFileURL = documentDirectoryURL.appendingPathComponent("copy_example.txt")
   do {
       try FileManager.default.copyItem(at: fileURL, to: copyFileURL)
   } catch {
       print(error)
   }
   ```

这些是一些常见的用于处理文件路径和文件操作的方法。根据您的需求，您可以选择适当的方法来管理文件和文件夹。记得要适当地处理错误情况以及验证文件操作的成功与否。

不会，`FileHandle(forWritingTo:)`方法在文件不存在时不会自动生成文件。它只能用于打开已存在的文件以进行写入操作。如果文件不存在，会抛出异常。

如果您想要在文件不存在时自动创建文件并追加内容，您可以使用`FileHandle(forUpdating:)`方法，它会自动创建文件并打开它，允许您在文件末尾追加内容。以下是使用`FileHandle(forUpdating:)`方法的示例代码：

```swift
import Foundation

// 要追加的文本内容
let additionalText = """
This is additional text that will be appended to the file.
"""

// 获取文档目录路径
guard let documentDirectoryURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
    fatalError("Could not access document directory")
}

// 构建要追加内容的文件的 URL
let fileName = "my_text_file.txt"
let fileURL = documentDirectoryURL.appendingPathComponent(fileName)

do {
    // 打开文件以进行追加操作（如果文件不存在，则会创建）
    let fileHandle = try FileHandle(forUpdating: fileURL)
    
    // 定位到文件末尾
    fileHandle.seekToEndOfFile()
    
    // 将追加的文本内容写入文件
    if let data = additionalText.data(using: .utf8) {
        fileHandle.write(data)
        print("Text appended to file: \(fileURL)")
    } else {
        print("Error converting text to data")
    }
    
    // 关闭文件
    fileHandle.closeFile()
} catch {
    print("Error appending to file: \(error)")
}
```

使用`FileHandle(forUpdating:)`方法，如果文件不存在，它会自动创建文件并打开以进行写入操作，允许在文件末尾追加内容。