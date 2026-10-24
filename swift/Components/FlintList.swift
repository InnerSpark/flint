import SwiftUI

public extension View {
  /// Settings-style grouped list on the page background. Native List, so swipe actions, edit mode
  /// and VoiceOver rotor navigation all keep working.
  func flintList() -> some View {
    self
      #if os(iOS)
      .listStyle(.insetGrouped)
      #endif
      .scrollContentBackground(.hidden)
      .background(Flint.Colors.surfacePage)
      .tint(Flint.Colors.actionPrimary)
  }

  /// Row surface and separator color for any custom row inside a `flintList()`.
  func flintRowStyle() -> some View {
    self
      .listRowBackground(Flint.Colors.surfaceDefault)
      .listRowSeparatorTint(Flint.Colors.borderDefault)
  }
}

/// A list row: optional icon, title, optional subtitle and trailing value. Read as one element
/// ("Wi-Fi, Trailer-5G"). The value moves under the title at accessibility text sizes.
/// Wrap it in a NavigationLink for a row that opens a screen; the chevron comes from the List.
public struct FlintRow: View {
  let title: String
  let subtitle: String?
  let value: String?
  let systemImage: String?
  @Environment(\.dynamicTypeSize) private var typeSize
  @ScaledMetric(relativeTo: .body) private var iconWidth: CGFloat = 28

  public init(_ title: String, subtitle: String? = nil, value: String? = nil, systemImage: String? = nil) {
    self.title = title
    self.subtitle = subtitle
    self.value = value
    self.systemImage = systemImage
  }

  public var body: some View {
    let stacked = typeSize.isAccessibilitySize
    HStack(spacing: Flint.Space.s12) {
      if let systemImage, !stacked {
        Image(systemName: systemImage)
          .foregroundStyle(Flint.Colors.selectedText)
          .frame(width: iconWidth)
      }
      let layout = stacked ? AnyLayout(VStackLayout(alignment: .leading, spacing: Flint.Space.s4)) : AnyLayout(HStackLayout(spacing: Flint.Space.s8))
      layout {
        VStack(alignment: .leading, spacing: Flint.Space.s2) {
          Text(title)
            .flintText(Flint.Typography.bodyMd)
            .foregroundStyle(Flint.Colors.textDefault)
          if let subtitle {
            Text(subtitle)
              .flintText(Flint.Typography.bodySm)
              .foregroundStyle(Flint.Colors.textMuted)
          }
        }
        if !stacked { Spacer(minLength: Flint.Space.s8) }
        if let value {
          Text(value)
            .flintText(Flint.Typography.bodyMd)
            .foregroundStyle(Flint.Colors.textMuted)
            .multilineTextAlignment(stacked ? .leading : .trailing)
        }
      }
    }
    .frame(minHeight: Flint.Target.minimum)
    .accessibilityElement(children: .combine)
    .flintRowStyle()
  }
}

/// A full-width action row, such as "Add a trip" or, with `role: .destructive`, "Delete trip".
/// Destructive rows use the danger color and words that say what will be lost.
public struct FlintRowButton: View {
  let title: String
  let role: ButtonRole?
  let action: () -> Void

  public init(_ title: String, role: ButtonRole? = nil, action: @escaping () -> Void) {
    self.title = title
    self.role = role
    self.action = action
  }

  public var body: some View {
    Button(role: role, action: action) {
      Text(title)
        .flintText(Flint.Typography.bodyMd)
        .foregroundStyle(role == .destructive ? Flint.Colors.actionDanger : Flint.Colors.actionPrimary)
        .frame(maxWidth: .infinity, minHeight: Flint.Target.minimum, alignment: .leading)
        .contentShape(Rectangle())
    }
    .flintRowStyle()
  }
}

/// A section header for `flintList()`: caption style, muted, and a header for VoiceOver.
public struct FlintListHeader: View {
  let text: String
  public init(_ text: String) { self.text = text }
  public var body: some View {
    Text(text)
      .flintText(Flint.Typography.labelCaption)
      .foregroundStyle(Flint.Colors.textMuted)
      .accessibilityAddTraits(.isHeader)
  }
}
