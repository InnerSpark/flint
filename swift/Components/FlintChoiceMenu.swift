import SwiftUI

/// Pick one of many options from a row that opens a menu: the title, the current choice, and the
/// system menu with a check on the selected item. For five or more options, or long labels, where
/// a segmented `FlintChoicePicker` would truncate. Add `detail` to explain the current choice.
public struct FlintChoiceMenu<Value: Hashable>: View {
  let title: String
  let options: [(value: Value, label: String)]
  @Binding var selection: Value
  var detail: String?
  var disabledReason: String?
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: String, selection: Binding<Value>, options: [(value: Value, label: String)],
              detail: String? = nil, disabledReason: String? = nil) {
    self.title = title
    self._selection = selection
    self.options = options
    self.detail = detail
    self.disabledReason = disabledReason
  }

  private var current: String { options.first { $0.value == selection }?.label ?? "" }

  public var body: some View {
    Menu {
      Picker(title, selection: $selection) {
        ForEach(Array(options.enumerated()), id: \.offset) { _, option in
          Text(option.label).tag(option.value)
        }
      }
    } label: {
      HStack(spacing: Flint.Space.s12) {
        VStack(alignment: .leading, spacing: Flint.Space.s2) {
          Text(title)
            .flintText(Flint.Typography.labelDefault)
            .foregroundStyle(isEnabled ? Flint.Colors.textHeading : Flint.Colors.actionDisabled)
          if let note = !isEnabled ? (disabledReason ?? detail) : detail {
            Text(note)
              .flintText(Flint.Typography.labelCaption)
              .foregroundStyle(Flint.Colors.textMuted)
              .fixedSize(horizontal: false, vertical: true)
              .multilineTextAlignment(.leading)
          }
        }
        Spacer(minLength: Flint.Space.s8)
        Text(current)
          .flintText(Flint.Typography.labelDefault)
          .foregroundStyle(isEnabled ? Flint.Colors.actionPrimary : Flint.Colors.actionDisabled)
        Image(systemName: "chevron.up.chevron.down")
          .imageScale(.small)
          .foregroundStyle(isEnabled ? Flint.Colors.actionPrimary : Flint.Colors.actionDisabled)
          .accessibilityHidden(true)
      }
      .frame(minHeight: Flint.Target.minimum)
      .contentShape(Rectangle())
    }
    .flintCard(padding: Flint.Space.s12)
    .accessibilityLabel(title)
    .accessibilityValue(current)
    .accessibilityHint(!isEnabled ? (disabledReason ?? "") : (detail ?? ""))
  }
}
