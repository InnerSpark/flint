import SwiftUI

public extension View {
  /// A floating control over content, such as a map's Locate button or a media player's controls.
  /// iOS 26 and later: Apple's Liquid Glass button (`.glass`, or `.glassProminent` for the main
  /// action), tinted with the brand's primary action color. Earlier: Flint's secondary or primary button.
  ///
  /// Glass belongs to the navigation layer. Use `.buttonStyle(.flint(...))` for buttons inside
  /// content: forms, cards, notices.
  @ViewBuilder func flintGlassButton(prominent: Bool = false) -> some View {
    if #available(iOS 26, macOS 26, *) {
      if prominent {
        // The label uses the on-primary color, so it keeps Flint's contrast in dark mode, where
        // the primary fill is light.
        self.buttonStyle(.glassProminent)
          .tint(Flint.Colors.actionPrimary)
          .foregroundStyle(Flint.Colors.actionOnPrimary)
      } else {
        self.buttonStyle(.glass)
          .tint(Flint.Colors.actionPrimary)
      }
    } else {
      self.buttonStyle(.flint(prominent ? .primary : .secondary))
    }
  }
}
