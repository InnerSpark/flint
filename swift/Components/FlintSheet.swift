import SwiftUI

public extension View {
  /// Flint sheet: detents and a visible grab handle. On iOS 26 and later the sheet is Liquid Glass
  /// at partial heights and turns solid as it grows, so Flint leaves its background and corners to
  /// the system. Before 26 it gets the default surface and the large card radius.
  /// Apply to the sheet's content: `.sheet(isPresented: $open) { TripForm().flintSheet() }`.
  func flintSheet(detents: Set<PresentationDetent> = [.medium, .large]) -> some View {
    modifier(FlintSheetModifier(detents: detents))
  }
}

private struct FlintSheetModifier: ViewModifier {
  let detents: Set<PresentationDetent>

  @ViewBuilder func body(content: Content) -> some View {
    let base = content
      .presentationDetents(detents)
      .presentationDragIndicator(.visible)
    if #available(iOS 26, macOS 26, *) {
      base
    } else if #available(iOS 16.4, macOS 13.3, *) {
      base
        .presentationBackground(Flint.Colors.surfaceDefault)
        .presentationCornerRadius(Flint.Radius.cardLg)
    } else {
      base
    }
  }
}

/// The top of a sheet: its title as a heading and a Close button. Sheets must always offer a
/// visible way out besides the swipe, since not everyone can swipe.
public struct FlintSheetHeader: View {
  let title: String
  let closeLabel: String
  let onClose: () -> Void

  public init(_ title: String, closeLabel: String = "Close", onClose: @escaping () -> Void) {
    self.title = title
    self.closeLabel = closeLabel
    self.onClose = onClose
  }

  public var body: some View {
    HStack(alignment: .firstTextBaseline, spacing: Flint.Space.s12) {
      Text(title)
        .flintText(Flint.Typography.headingH2)
        .foregroundStyle(Flint.Colors.textHeading)
        .accessibilityAddTraits(.isHeader)
      Spacer(minLength: 0)
      Button(action: onClose) {
        Image(systemName: "xmark").font(.body.weight(.semibold))
      }
      .buttonStyle(.flint(.text))
      .accessibilityLabel(closeLabel)
    }
    .padding(.horizontal, Flint.Space.s16)
    .padding(.top, Flint.Space.s16)
  }
}
