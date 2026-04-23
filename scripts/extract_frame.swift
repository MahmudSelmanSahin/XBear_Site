import Foundation
import AVFoundation
import AppKit

if CommandLine.arguments.count < 4 {
    fputs("Usage: extract_frame.swift <inputVideo> <outputJpg> <seconds>\n", stderr)
    exit(1)
}

let inputPath = CommandLine.arguments[1]
let outputPath = CommandLine.arguments[2]
let seconds = Double(CommandLine.arguments[3]) ?? 1.0

let inputURL = URL(fileURLWithPath: inputPath)
let outputURL = URL(fileURLWithPath: outputPath)

let asset = AVAsset(url: inputURL)
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.requestedTimeToleranceBefore = .zero
generator.requestedTimeToleranceAfter = .zero

let requestedTime = CMTime(seconds: max(0.0, seconds), preferredTimescale: 600)

do {
    let cgImage = try generator.copyCGImage(at: requestedTime, actualTime: nil)
    let bitmap = NSBitmapImageRep(cgImage: cgImage)
    guard let data = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.9]) else {
        fputs("Failed to encode JPEG for \(inputPath)\n", stderr)
        exit(2)
    }

    let dirURL = outputURL.deletingLastPathComponent()
    try FileManager.default.createDirectory(at: dirURL, withIntermediateDirectories: true)
    try data.write(to: outputURL)
    print(outputPath)
} catch {
    fputs("Failed extracting frame for \(inputPath): \(error)\n", stderr)
    exit(3)
}
