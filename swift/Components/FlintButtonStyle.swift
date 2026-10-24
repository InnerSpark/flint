import SwiftUI

/// Flint buttons: the button component tokens, a 44pt minimum height on iOS, and visible
/// pressed and disabled states. `Button("Save") {}.buttonStyle(.flint(.primary))`
public struct FlintButtonStyle: ButtonStyle {
  public enum Kind: Sendable { case primary, secondary, danger, text }
  public let kind: Kind
  public var fullWidth: Bool

  public init(_ kind: Kind = .primary, fullWidth: Bool = false) {
    self.kind = kind
    self.fullWidth = fullWidth
  }

  public func makeBody(configuration: Configuration) -> some View {
    Body(kind: kind, fullWidth: fullWidth, configuration: configuration)
  }

  // A view, so it can read isEnabled; a custom ButtonStyle gets no automatic dimming.
  private struct Body: View {
    let kind: Kind
    let fullWidth: Bool
    let configuration: ButtonStyleConfiguration
    @Environment(\.isEnabled) private var isEnabled

    var body: some View {
      let shape = RoundedRectangle(cornerRadius: Flint.Component.buttonRadius, style: .continuous)
      configuration.label
        .flintText(Flint.Typography.labelButton)
        .multilineTextAlignment(.center)
        .padding(.horizontal, Flint.Space.s16)
        .padding(.vertical, Flint.Space.s8)
        .frame(maxWidth: fullWidth ? .infinity : nil, minHeight: Flint.Component.buttonHeight)
        .foregroundStyle(ink)
        .background(shape.fill(fill))
        .overlay(shape.strokeBorder(stroke, lineWidth: 1))
        .contentShape(shape)
    }

    private var pressed: Bool { configuration.isPressed }

    private var ink: Color {
      guard isEnabled else { return Flint.Component.buttonDisabledFg }
      switch kind {
      case .primary: return Flint.Component.buttonPrimaryFg
      case .secondary: return Flint.Component.buttonSecondaryFg
      case .danger: return Flint.Component.buttonDangerFg
      case .text: return Flint.Component.buttonTextFg
      }
    }

    private var fill: Color {
      guard isEnabled else { return kind == .text ? .clear : Flint.Component.buttonDisabledBg }
      switch kind {
      case .primary: return pressed ? Flint.Component.buttonPrimaryBgPressed : Flint.Component.buttonPrimaryBg
      case .secondary: return pressed ? Flint.Component.buttonSecondaryBgHover : Flint.Component.buttonSecondaryBg
      case .danger: return pressed ? Flint.Component.buttonDangerBgPressed : Flint.Component.buttonDangerBg
      case .text: return pressed ? Flint.Component.buttonTextBgHover : .clear
      }
    }

    private var stroke: Color {
      guard isEnabled else { return kind == .text ? .clear : Flint.Component.buttonDisabledBorder }
      return kind == .secondary ? Flint.Component.buttonSecondaryBorder : .clear
    }
  }
}

public extension ButtonStyle where Self == FlintButtonStyle {
  /// `.buttonStyle(.flint(.secondary))`
  static func flint(_ kind: FlintButtonStyle.Kind = .primary, fullWidth: Bool = false) -> FlintButtonStyle {
    FlintButtonStyle(kind, fullWidth: fullWidth)
  }
}
