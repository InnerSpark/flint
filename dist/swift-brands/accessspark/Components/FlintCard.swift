// GENERATED copy of swift/Components/FlintCard.swift. Edit the source, not this file.
// Flint SwiftUI components (ASDS-38). Shared by every brand product: the build copies this folder
// next to each brand's generated tokens, so `Flint.*` here resolves to that brand.
import SwiftUI

public extension View {
  /// Flint card: default surface, card radius, hairline edge. The edge is decorative; the card's
  /// contents carry the meaning.
  func flintCard(padding: CGFloat = Flint.Space.s16) -> some View {
    self
      .padding(padding)
      .frame(maxWidth: .infinity, alignment: .topLeading)
      .background(Flint.Colors.surfaceDefault, in: RoundedRectangle(cornerRadius: Flint.Radius.card, style: .continuous))
      .overlay(
        RoundedRectangle(cornerRadius: Flint.Radius.card, style: .continuous)
          .strokeBorder(Flint.Colors.borderDefault, lineWidth: 1)
      )
  }
}
