import SwiftUI

/// A small status pill: words, an optional icon, the tone's colors. Not a button; for a control,
/// use a Button with `.flint(.secondary)`.
public struct FlintTag: View {
  let text: String
  let tone: FlintTone
  let symbol: String?
  let spoken: String?

  /// `spokenLabel` replaces what VoiceOver reads, e.g. "Connection: Live" for a pill that shows "Live".
  public init(_ text: String, tone: FlintTone = .neutral, systemImage: String? = nil, spokenLabel: String? = nil) {
    self.text = text
    self.tone = tone
    self.symbol = systemImage
    self.spoken = spokenLabel
  }

  public var body: some View {
    HStack(spacing: Flint.Space.s4) {
      if let symbol { Image(systemName: symbol).imageScale(.small).accessibilityHidden(true) }
      Text(text).flintText(Flint.Typography.labelDefault)
    }
    .foregroundStyle(tone.text)
    .padding(.horizontal, Flint.Space.s12)
    .padding(.vertical, Flint.Space.s4)
    .background(tone.surface, in: Capsule())
    .overlay(Capsule().strokeBorder(tone.border, lineWidth: 1))
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(spoken ?? text)
  }
}
