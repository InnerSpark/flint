import SwiftUI

/// A message on a tinted surface: optional title, body, and the tone's icon (or your own).
/// Read as one element by VoiceOver. For something the person must act on, put the action in the content.
public struct FlintNotice<Actions: View>: View {
  let tone: FlintTone
  let title: String?
  let message: String
  let symbol: String?
  let actions: Actions

  public init(_ message: String, title: String? = nil, tone: FlintTone = .info, systemImage: String? = nil, @ViewBuilder actions: () -> Actions) {
    self.message = message
    self.title = title
    self.tone = tone
    self.symbol = systemImage
    self.actions = actions()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: Flint.Space.s12) {
      Label {
        VStack(alignment: .leading, spacing: Flint.Space.s4) {
          if let title {
            Text(title)
              .flintText(Flint.Typography.headingH3)
              .foregroundStyle(tone.text)
              .accessibilityAddTraits(.isHeader)
          }
          Text(message)
            .flintText(Flint.Typography.bodySm)
            .foregroundStyle(Flint.Colors.textDefault)
            .fixedSize(horizontal: false, vertical: true)
        }
      } icon: {
        Image(systemName: symbol ?? tone.symbol).foregroundStyle(tone.text)
      }
      actions
    }
    .padding(Flint.Space.s16)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(tone.surface, in: RoundedRectangle(cornerRadius: Flint.Radius.card, style: .continuous))
    .overlay(RoundedRectangle(cornerRadius: Flint.Radius.card, style: .continuous).strokeBorder(tone.border, lineWidth: 1))
    .accessibilityElement(children: .contain)
  }
}

public extension FlintNotice where Actions == EmptyView {
  init(_ message: String, title: String? = nil, tone: FlintTone = .info, systemImage: String? = nil) {
    self.init(message, title: title, tone: tone, systemImage: systemImage) { EmptyView() }
  }
}
