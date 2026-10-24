// GENERATED copy of swift/Components/FlintSectionTitle.swift. Edit the source, not this file.
import SwiftUI

/// A section heading: headingH3, heading color, and the header trait so VoiceOver's rotor finds it.
public struct FlintSectionTitle: View {
  let text: String
  public init(_ text: String) { self.text = text }
  public var body: some View {
    Text(text)
      .flintText(Flint.Typography.headingH3)
      .foregroundStyle(Flint.Colors.textHeading)
      .accessibilityAddTraits(.isHeader)
  }
}
