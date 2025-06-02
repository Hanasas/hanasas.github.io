---
title: Swift iOS中的文件读写
date: 2023-03-14
updated: 2023-03-14
categories: Swift 笔记
tags:
  - Swift
  - 笔记
top: 1
excerpt: ""
excerptAlign: left
---
1. **文本文件 (.txt, .csv, .json 等)**:
   您可以使用`String`或`Data`来读写文本文件。以下是一个读写文本文件的示例：

   ```swift
   // 写入文本文件
   let text = "Hello, Swift!"
   let fileURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("example.txt")
   do {
       try text.write(to: fileURL, atomically: false, encoding: .utf8)
   } catch {
       print(error)
   }

   // 读取文本文件
   do {
       let fileContents = try String(contentsOf: fileURL, encoding: .utf8)
       print(fileContents)
   } catch {
       print(error)
   }
   ```

2. **属性列表文件 (.plist)**:
   属性列表是一种用于存储基本数据类型的文件格式。以下是一个读写属性列表文件的示例：

   ```swift
   // 写入属性列表文件
   let data = ["Name": "John", "Age": 30] as NSDictionary
   let fileURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("example.plist")
   data.write(to: fileURL, atomically: true)

   // 读取属性列表文件
   if let plistData = NSDictionary(contentsOf: fileURL) as? [String: Any] {
       print(plistData)
   }
   ```

3. **二进制文件 (自定义格式)**:
   如果您需要读写自定义二进制文件格式，您可以使用`Data`类型来处理二进制数据。这可以用于处理图像、音频等文件。

   ```swift
   // 写入二进制文件
   let binaryData = Data([0x01, 0x02, 0x03, 0x04])
   let fileURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("example.bin")
   do {
       try binaryData.write(to: fileURL)
   } catch {
       print(error)
   }

   // 读取二进制文件
   do {
       let binaryData = try Data(contentsOf: fileURL)
       // 处理二进制数据
   } catch {
       print(error)
   }
   ```

请根据您的需求选择适合的文件类型和读写方式。记得在进行文件操作时要处理可能的错误以及适当的异常情况。此外，根据您的应用程序需求，您还可以使用第三方库来更方便地处理文件操作。