import SwiftUI

/// A large on/off row in a card: title, detail, and, when disabled, the reason shown and read aloud.
public struct FlintToggleRow: View {
  let title: String
  let detail: String?
  @Binding var isOn: Bool
  var disabledReason: String?
  @Environment(\.isEnabled) private var isEnabled

  public init(_ title: String, detail: String? = nil, isOn: Binding<Bool>, disabledReason: String? = nil) {
    self.title = title
    self.detail = detail
    self._isOn = isOn
    self.disabledReason = disabledReason
  }

  public var body: some View {
    Toggle(isOn: $isOn) {
      VStack(alignment: .leading, spacing: Flint.Space.s2) {
        Text(title)
          .flintText(Flint.Typography.headingH3)
          .foregroundStyle(isEnabled ? Flint.Colors.textHeading : Flint.Colors.textMuted)
        if let detail {
          Text(detail)
            .flintText(Flint.Typography.bodySm)
            .foregroundStyle(Flint.Colors.textMuted)
            .fixedSize(horizontal: false, vertical: true)
        }
        if !isEnabled, let disabledReason {
          Text(disabledReason)
            .flintText(Flint.Typography.labelCaption)
            .foregroundStyle(Flint.Colors.textMuted)
            .fixedSize(horizontal: false, vertical: true)
        }
      }
    }
    .tint(Flint.Colors.actionPrimary)
    .frame(minHeight: Flint.Target.minimum)
    .flintCard()
  }
}
