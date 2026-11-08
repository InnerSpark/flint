// GENERATED copy of swift/Components/FlintPreviews.swift. Edit the source, not this file.
#if DEBUG
import SwiftUI

/// Every component in light, dark and Accessibility 3 text, for Xcode previews.
struct FlintComponentPreviews: PreviewProvider {
  struct Sample: View {
    @State private var on = true
    @State private var mode = 0
    @State private var temp = 72

    var body: some View {
      NavigationStack {
        FlintScreen("Trips") {
          FlintSectionTitle("Today")
          FlintNotice("Rain after 6 PM. Pack the awning.", tone: .info)
          FlintNotice("The trailer is out of range.", title: "Can't connect", tone: .error) {
            Button("Try again") {}.buttonStyle(.flint(.primary))
          }
          HStack { FlintTag("Live", tone: .success, systemImage: "checkmark.circle.fill"); FlintTag("Preview") }
          FlintStatTile("Battery", systemImage: "battery.75", value: "82%", detail: "About 9 hours left", spokenValue: "82 percent, about 9 hours left")
          FlintToggleRow("Awning lights", detail: "Warm white strip", isOn: $on)
          FlintChoicePicker("Mode", selection: $mode, options: [(0, "Cool"), (1, "Heat"), (2, "Fan")])
          FlintStepper("Temperature", value: $temp, in: 60...85, display: { "\($0)°" }, spoken: { "\($0) degrees" })
          FlintEmptyState("No trips yet", systemImage: "map", message: "Plan one to see it here.") {
            Button("Plan a trip") {}.buttonStyle(.flint(.secondary))
          }
          HStack {
            Button("Save") {}.buttonStyle(.flint(.primary))
            Button("Cancel") {}.buttonStyle(.flint(.secondary))
            Button("Delete") {}.buttonStyle(.flint(.danger))
            Button("Skip") {}.buttonStyle(.flint(.text))
          }
          HStack {
            Button("Locate", systemImage: "location") {}.flintGlassButton()
            Button("Start trip") {}.flintGlassButton(prominent: true)
          }
        }
      }
    }
  }

  struct ListSample: View {
    var body: some View {
      NavigationStack {
        List {
          Section { FlintRow("Wi-Fi", value: "Trailer-5G", systemImage: "wifi"); FlintRow("Cerbo", subtitle: "192.168.1.20", systemImage: "server.rack") } header: { FlintListHeader("Connections") }
          Section { FlintRowButton("Delete trip", role: .destructive) {} }
        }
        .flintList()
        .navigationTitle("Settings")
      }
    }
  }

  static var previews: some View {
    Group {
      Sample().previewDisplayName("Light")
      Sample().preferredColorScheme(.dark).previewDisplayName("Dark")
      Sample().dynamicTypeSize(.accessibility3).previewDisplayName("Accessibility 3")
      ListSample().previewDisplayName("List")
      ListSample().preferredColorScheme(.dark).dynamicTypeSize(.accessibility3).previewDisplayName("List, dark, AX3")
    }
  }
}
#endif
