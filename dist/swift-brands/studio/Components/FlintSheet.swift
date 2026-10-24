// GENERATED copy of swift/Components/FlintSheet.swift. Edit the source, not this file.
import SwiftUI

public extension View {
  /// Flint sheet: detents, a visible grab handle, the default surface and the large card radius.
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
    if #available(iOS 16.4, macOS 13.3, *) {
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
