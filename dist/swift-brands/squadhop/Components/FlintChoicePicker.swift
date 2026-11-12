// GENERATED copy of swift/Components/FlintChoicePicker.swift. Edit the source, not this file.
import SwiftUI

/// Pick one of a few options. A segmented control normally; a list of rows with a checkmark at
/// the larger text sizes, where segment labels would truncate.
public struct FlintChoicePicker<Value: Hashable>: View {
  let title: String
  let options: [(value: Value, label: String)]
  @Binding var selection: Value
  var disabledReason: String?
  @Environment(\.dynamicTypeSize) private var typeSize
  @Environment(\.isEnabled) private var isEnabled

  /// `disabledReason` is read as the hint when the picker is disabled, so nobody has to guess why.
  public init(_ title: String, selection: Binding<Value>, options: [(value: Value, label: String)], disabledReason: String? = nil) {
    self.title = title
    self._selection = selection
    self.options = options
    self.disabledReason = disabledReason
  }

  public var body: some View {
    Group {
      if typeSize >= .xxxLarge {
        VStack(spacing: 0) {
          ForEach(Array(options.enumerated()), id: \.offset) { i, option in
            if i > 0 { Divider().overlay(Flint.Colors.borderDefault) }
            Row(label: option.label, selected: selection == option.value) { selection = option.value }
          }
        }
        .flintCard(padding: Flint.Space.s12)
        .accessibilityElement(children: .contain)
        .accessibilityLabel(title)
      } else {
        Picker(title, selection: $selection) {
          ForEach(Array(options.enumerated()), id: \.offset) { _, option in
            Text(option.label).tag(option.value)
          }
        }
        .pickerStyle(.segmented)
        .controlSize(.large)
        .frame(minHeight: Flint.Target.minimum)
      }
    }
    .accessibilityHint(!isEnabled ? (disabledReason ?? "") : "")
  }

  private struct Row: View {
    let label: String
    let selected: Bool
    let action: () -> Void
    @Environment(\.isEnabled) private var isEnabled

    var body: some View {
      Button(action: action) {
        HStack {
          Text(label)
            .flintText(Flint.Typography.bodyMd)
            .foregroundStyle(isEnabled ? Flint.Colors.textDefault : Flint.Colors.actionDisabled)
            .fixedSize(horizontal: false, vertical: true)
          Spacer()
          if selected {
            Image(systemName: "checkmark")
              .foregroundStyle(isEnabled ? Flint.Colors.actionPrimary : Flint.Colors.actionDisabled)
              .accessibilityHidden(true)
          }
        }
        .frame(minHeight: Flint.Target.minimum)
        .contentShape(Rectangle())
      }
      .buttonStyle(.plain)
      .accessibilityAddTraits(selected ? .isSelected : [])
    }
  }
}
