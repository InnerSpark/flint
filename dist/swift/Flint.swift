// GENERATED from tokens.json by scripts/build.mjs. Flint Design System. Do not edit by hand.
// Colors: Flint.Colors (semantic, light/dark aware) and Flint.Palette (raw ramps).
// Layout: Flint.Space, Flint.Radius, Flint.Control, Flint.IconSize, Flint.Target.
// Type:   Flint.Typography + .flintText(_:). Needs the Open Sans static TTFs bundled in the app.
// Motion: Flint.Motion.animation(_:duration:reduceMotion:) returns nil when Reduce Motion is on.
import SwiftUI
#if canImport(UIKit)
import UIKit
#elseif canImport(AppKit)
import AppKit
#endif

public enum Flint {
  /// Semantic colors. Each resolves to its light or dark value from the system appearance.
  public enum Colors {
    public static let surfacePage = dynamic(light: 0xf8fafc, dark: 0x0d1117)
    public static let surfaceDefault = dynamic(light: 0xffffff, dark: 0x161b22)
    public static let surfaceSubtle = dynamic(light: 0xf1f5f9, dark: 0x21262d)
    public static let surfaceInverse = dynamic(light: 0x0d2b45, dark: 0xf8fafc)
    public static let surfaceCode = dynamic(light: 0x1e293b, dark: 0x010409)
    public static let textHeading = dynamic(light: 0x0d2b45, dark: 0xf0f6fc)
    public static let textDefault = dynamic(light: 0x1e293b, dark: 0xc9d1d9)
    public static let textMuted = dynamic(light: 0x334155, dark: 0xaeb8c2)
    public static let textPlaceholder = dynamic(light: 0x334155, dark: 0xaeb8c2)
    public static let textLink = dynamic(light: 0x1550a0, dark: 0x93c5fd)
    public static let textInverse = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let textOnCode = dynamic(light: 0xffffff, dark: 0xffffff)
    public static let actionPrimary = dynamic(light: 0x1550a0, dark: 0x93c5fd)
    public static let actionPrimaryHover = dynamic(light: 0x0d3b6e, dark: 0xbfdbfe)
    public static let actionOnPrimary = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let actionSecondary = dynamic(light: 0x38bdf8, dark: 0x38bdf8)
    public static let actionFocusRing = dynamic(light: 0x1550a0, dark: 0x60a5fa)
    public static let actionDanger = dynamic(light: 0x991b1b, dark: 0xfca5a5)
    public static let actionDangerHover = dynamic(light: 0x7f1d1d, dark: 0xfecaca)
    public static let actionOnDanger = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let actionDisabled = dynamic(light: 0x64748b, dark: 0x828b95)
    public static let actionDisabledBg = dynamic(light: 0xf1f5f9, dark: 0x21262d)
    public static let borderDefault = dynamic(light: 0xe2e8f0, dark: 0x6e7681)
    public static let borderControl = dynamic(light: 0x64748b, dark: 0x6e7681)
    public static let borderControlHover = dynamic(light: 0x475569, dark: 0x9aa4af)
    public static let borderStrong = dynamic(light: 0xcbd5e1, dark: 0xaeb8c2)
    public static let borderFocus = dynamic(light: 0x1550a0, dark: 0x60a5fa)
    public static let borderError = dynamic(light: 0xdc2626, dark: 0xf87171)
    public static let borderDisabled = dynamic(light: 0xe2e8f0, dark: 0x545d68)
    public static let feedbackSuccessSurface = dynamic(light: 0xf0fdf4, dark: 0x14532d)
    public static let feedbackSuccessBorder = dynamic(light: 0xbbf7d0, dark: 0x166534)
    public static let feedbackSuccessSolid = dynamic(light: 0x166534, dark: 0x4ade80)
    public static let feedbackSuccessText = dynamic(light: 0x14532d, dark: 0xbbf7d0)
    public static let feedbackSuccessOnSolid = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let feedbackWarningSurface = dynamic(light: 0xfffbeb, dark: 0x78350f)
    public static let feedbackWarningBorder = dynamic(light: 0xfde68a, dark: 0x92400e)
    public static let feedbackWarningSolid = dynamic(light: 0x92400e, dark: 0xfbbf24)
    public static let feedbackWarningText = dynamic(light: 0x78350f, dark: 0xfde68a)
    public static let feedbackWarningOnSolid = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let feedbackErrorSurface = dynamic(light: 0xfef2f2, dark: 0x7f1d1d)
    public static let feedbackErrorBorder = dynamic(light: 0xfecaca, dark: 0x991b1b)
    public static let feedbackErrorSolid = dynamic(light: 0x991b1b, dark: 0xfca5a5)
    public static let feedbackErrorText = dynamic(light: 0x7f1d1d, dark: 0xfee2e2)
    public static let feedbackErrorOnSolid = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let feedbackInfoSurface = dynamic(light: 0xeff6ff, dark: 0x0d2b45)
    public static let feedbackInfoBorder = dynamic(light: 0xdbeafe, dark: 0x0d3b6e)
    public static let feedbackInfoSolid = dynamic(light: 0x1550a0, dark: 0x93c5fd)
    public static let feedbackInfoText = dynamic(light: 0x0d3b6e, dark: 0x93c5fd)
    public static let feedbackInfoOnSolid = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let accentAaaSurface = dynamic(light: 0xede9fe, dark: 0x4c1d95)
    public static let accentAaaSolid = dynamic(light: 0x6d28d9, dark: 0xc4b5fd)
    public static let accentAaaText = dynamic(light: 0x5b21b6, dark: 0xddd6fe)
    public static let accentOnAaa = dynamic(light: 0xffffff, dark: 0x0d1117)
    public static let accentCyan = dynamic(light: 0x0c4a6e, dark: 0x7dd3fc)
    public static let selectedSurface = dynamic(light: 0xeff6ff, dark: 0x0d3b6e)
    public static let selectedText = dynamic(light: 0x1550a0, dark: 0xbfdbfe)
    public static let overlayScrim = dynamic(light: 0x0f172a, lightOpacity: 0.5, dark: 0x000000, darkOpacity: 0.6)
  }

  /// Raw color ramps. Prefer Flint.Colors in UI; these values do not change between modes.
  public enum Palette {
    public static let blue50 = Color(flintHex: 0xeff6ff)
    public static let blue100 = Color(flintHex: 0xdbeafe)
    public static let blue200 = Color(flintHex: 0xbfdbfe)
    public static let blue300 = Color(flintHex: 0x93c5fd)
    public static let blue400 = Color(flintHex: 0x60a5fa)
    public static let blue500 = Color(flintHex: 0x2767cc)
    public static let blue600 = Color(flintHex: 0x1a5fa8)
    public static let blue700 = Color(flintHex: 0x1550a0)
    public static let blue800 = Color(flintHex: 0x0d3b6e)
    public static let blue900 = Color(flintHex: 0x0d2b45)
    public static let sky50 = Color(flintHex: 0xf0f9ff)
    public static let sky100 = Color(flintHex: 0xe0f2fe)
    public static let sky200 = Color(flintHex: 0xbae6fd)
    public static let sky300 = Color(flintHex: 0x7dd3fc)
    public static let sky400 = Color(flintHex: 0x38bdf8)
    public static let sky500 = Color(flintHex: 0x0ea5e9)
    public static let sky600 = Color(flintHex: 0x0284c7)
    public static let sky700 = Color(flintHex: 0x0369a1)
    public static let sky800 = Color(flintHex: 0x075985)
    public static let sky900 = Color(flintHex: 0x0c4a6e)
    public static let gray50 = Color(flintHex: 0xf8fafc)
    public static let gray100 = Color(flintHex: 0xf1f5f9)
    public static let gray200 = Color(flintHex: 0xe2e8f0)
    public static let gray300 = Color(flintHex: 0xcbd5e1)
    public static let gray350 = Color(flintHex: 0x9fadc1)
    public static let gray400 = Color(flintHex: 0x94a3b8)
    public static let gray450 = Color(flintHex: 0x8492a6)
    public static let gray500 = Color(flintHex: 0x64748b)
    public static let gray550 = Color(flintHex: 0x5f6f84)
    public static let gray600 = Color(flintHex: 0x475569)
    public static let gray700 = Color(flintHex: 0x334155)
    public static let gray800 = Color(flintHex: 0x1e293b)
    public static let gray900 = Color(flintHex: 0x0f172a)
    public static let ink50 = Color(flintHex: 0xf0f6fc)
    public static let ink100 = Color(flintHex: 0xc9d1d9)
    public static let ink200 = Color(flintHex: 0xaeb8c2)
    public static let ink300 = Color(flintHex: 0x9aa4af)
    public static let ink400 = Color(flintHex: 0x828b95)
    public static let ink500 = Color(flintHex: 0x6e7681)
    public static let ink600 = Color(flintHex: 0x545d68)
    public static let ink700 = Color(flintHex: 0x21262d)
    public static let ink800 = Color(flintHex: 0x161b22)
    public static let ink900 = Color(flintHex: 0x0d1117)
    public static let ink950 = Color(flintHex: 0x010409)
    public static let green50 = Color(flintHex: 0xf0fdf4)
    public static let green100 = Color(flintHex: 0xdcfce7)
    public static let green200 = Color(flintHex: 0xbbf7d0)
    public static let green300 = Color(flintHex: 0x86efac)
    public static let green400 = Color(flintHex: 0x4ade80)
    public static let green500 = Color(flintHex: 0x22c55e)
    public static let green600 = Color(flintHex: 0x16a34a)
    public static let green700 = Color(flintHex: 0x15803d)
    public static let green800 = Color(flintHex: 0x166534)
    public static let green900 = Color(flintHex: 0x14532d)
    public static let amber50 = Color(flintHex: 0xfffbeb)
    public static let amber100 = Color(flintHex: 0xfef3c7)
    public static let amber200 = Color(flintHex: 0xfde68a)
    public static let amber300 = Color(flintHex: 0xfcd34d)
    public static let amber400 = Color(flintHex: 0xfbbf24)
    public static let amber500 = Color(flintHex: 0xf59e0b)
    public static let amber600 = Color(flintHex: 0xd97706)
    public static let amber700 = Color(flintHex: 0xb45309)
    public static let amber800 = Color(flintHex: 0x92400e)
    public static let amber900 = Color(flintHex: 0x78350f)
    public static let red50 = Color(flintHex: 0xfef2f2)
    public static let red100 = Color(flintHex: 0xfee2e2)
    public static let red200 = Color(flintHex: 0xfecaca)
    public static let red300 = Color(flintHex: 0xfca5a5)
    public static let red400 = Color(flintHex: 0xf87171)
    public static let red500 = Color(flintHex: 0xef4444)
    public static let red600 = Color(flintHex: 0xdc2626)
    public static let red700 = Color(flintHex: 0xb91c1c)
    public static let red800 = Color(flintHex: 0x991b1b)
    public static let red900 = Color(flintHex: 0x7f1d1d)
    public static let violet50 = Color(flintHex: 0xf5f3ff)
    public static let violet100 = Color(flintHex: 0xede9fe)
    public static let violet200 = Color(flintHex: 0xddd6fe)
    public static let violet300 = Color(flintHex: 0xc4b5fd)
    public static let violet400 = Color(flintHex: 0xa78bfa)
    public static let violet500 = Color(flintHex: 0x8b5cf6)
    public static let violet600 = Color(flintHex: 0x7c3aed)
    public static let violet700 = Color(flintHex: 0x6d28d9)
    public static let violet800 = Color(flintHex: 0x5b21b6)
    public static let violet900 = Color(flintHex: 0x4c1d95)
    public static let white = Color(flintHex: 0xffffff)
    public static let black = Color(flintHex: 0x0a0f1a)
  }

  public enum Space {
    public static let s0: CGFloat = 0
    public static let s2: CGFloat = 2
    public static let s4: CGFloat = 4
    public static let s8: CGFloat = 8
    public static let s12: CGFloat = 12
    public static let s16: CGFloat = 16
    public static let s24: CGFloat = 24
    public static let s32: CGFloat = 32
    public static let s40: CGFloat = 40
    public static let s48: CGFloat = 48
    public static let s64: CGFloat = 64
  }

  public enum Radius {
    public static let xs: CGFloat = 4
    public static let sm: CGFloat = 8
    public static let md: CGFloat = 12
    public static let lg: CGFloat = 16
    public static let pill: CGFloat = 9999
  }

  /// Control heights.
  public enum Control {
    public static let sm: CGFloat = 32
    public static let md: CGFloat = 40
  }

  public enum IconSize {
    public static let sm: CGFloat = 16
    public static let md: CGFloat = 20
    public static let lg: CGFloat = 24
  }

  public enum Target {
    /// Flint targetMin (WCAG 2.2 AA, 2.5.8).
    public static let minimum: CGFloat = 24
    /// Apple HIG minimum hit target. Use this for touch UI on iOS.
    public static let touch: CGFloat = 44
  }

  public enum Typography {
    public static let display = FlintTextStyle(fontName: "OpenSans-Bold", size: 48, relativeTo: .largeTitle, lineHeight: 1.2, tracking: -1.2)
    public static let displayXl = FlintTextStyle(fontName: "OpenSans-ExtraBold", size: 56, relativeTo: .largeTitle, lineHeight: 1.08, tracking: -2)
    public static let headingH1 = FlintTextStyle(fontName: "OpenSans-Bold", size: 36, relativeTo: .largeTitle, lineHeight: 1.2, tracking: -0.8)
    public static let headingH2 = FlintTextStyle(fontName: "OpenSans-Bold", size: 24, relativeTo: .title2, lineHeight: 1.3, tracking: -0.4)
    public static let headingH3 = FlintTextStyle(fontName: "OpenSans-Bold", size: 18, relativeTo: .title3, lineHeight: 1.4, tracking: 0)
    public static let bodyLg = FlintTextStyle(fontName: "OpenSans-Regular", size: 18, relativeTo: .body, lineHeight: 1.6, tracking: 0)
    public static let bodyMd = FlintTextStyle(fontName: "OpenSans-Regular", size: 16, relativeTo: .body, lineHeight: 1.5, tracking: 0)
    public static let bodySm = FlintTextStyle(fontName: "OpenSans-Regular", size: 14, relativeTo: .subheadline, lineHeight: 1.5, tracking: 0)
    public static let labelButton = FlintTextStyle(fontName: "OpenSans-Bold", size: 14, relativeTo: .subheadline, lineHeight: 1, tracking: 0)
    public static let labelDefault = FlintTextStyle(fontName: "OpenSans-SemiBold", size: 14, relativeTo: .subheadline, lineHeight: 1.4, tracking: 0)
    public static let labelCaption = FlintTextStyle(fontName: "OpenSans-SemiBold", size: 12, relativeTo: .caption, lineHeight: 1.3, tracking: 0.5)
    public static let labelKicker = FlintTextStyle(fontName: "OpenSans-Bold", size: 12, relativeTo: .caption, lineHeight: 1.2, tracking: 1.68)
    public static let labelFinePrint = FlintTextStyle(fontName: "OpenSans-Bold", size: 12, relativeTo: .caption, lineHeight: 1.2, tracking: 0.55)
    public static let labelHelper = FlintTextStyle(fontName: "OpenSans-Regular", size: 12, relativeTo: .caption, lineHeight: 1.4, tracking: 0)
  }

  public enum Motion {
    public enum Duration {
      public static let instant: Double = 0
      public static let fast: Double = 0.12
      public static let base: Double = 0.2
      public static let slow: Double = 0.32
    }

    public enum Easing: Sendable {
      case standard, entrance, exit

      var controlPoints: (Double, Double, Double, Double) {
        switch self {
        case .standard: return (0.2, 0, 0, 1)
        case .entrance: return (0, 0, 0.2, 1)
        case .exit: return (0.4, 0, 1, 1)
        }
      }
    }

    /// Returns nil when reduceMotion is true, so withAnimation(...) applies the change instantly.
    /// Read reduceMotion from @Environment(\.accessibilityReduceMotion).
    public static func animation(_ easing: Easing = .standard, duration: Double = Duration.base, reduceMotion: Bool) -> Animation? {
      guard !reduceMotion, duration > 0 else { return nil }
      let p = easing.controlPoints
      return .timingCurve(p.0, p.1, p.2, p.3, duration: duration)
    }
  }
}

public struct FlintTextStyle {
  public let fontName: String
  public let size: CGFloat
  public let relativeTo: Font.TextStyle
  /// Line height as a multiple of size (CSS unitless line-height).
  public let lineHeight: CGFloat
  /// Letter spacing in points.
  public let tracking: CGFloat

  public init(fontName: String, size: CGFloat, relativeTo: Font.TextStyle, lineHeight: CGFloat, tracking: CGFloat) {
    self.fontName = fontName
    self.size = size
    self.relativeTo = relativeTo
    self.lineHeight = lineHeight
    self.tracking = tracking
  }

  /// Scales with Dynamic Type relative to `relativeTo`.
  public var font: Font { .custom(fontName, size: size, relativeTo: relativeTo) }
  /// Extra space between lines at the base size. SwiftUI adds lineSpacing on top of the font's own
  /// line height, so this is the target (size x lineHeight) minus what the font already provides.
  public var lineSpacing: CGFloat {
    #if canImport(UIKit)
    let natural = UIFont(name: fontName, size: size)?.lineHeight
    #elseif canImport(AppKit)
    let natural = NSFont(name: fontName, size: size).map { $0.ascender - $0.descender + $0.leading }
    #else
    let natural: CGFloat? = nil
    #endif
    // Open Sans hhea metrics (ascender 2189 + descender 600) / 2048 units per em, if the font is not bundled yet.
    return max(0, size * lineHeight - (natural ?? size * 1.362))
  }
}

private struct FlintTextModifier: ViewModifier {
  let style: FlintTextStyle
  @ScaledMetric private var lineSpacing: CGFloat
  @ScaledMetric private var tracking: CGFloat

  init(style: FlintTextStyle) {
    self.style = style
    _lineSpacing = ScaledMetric(wrappedValue: style.lineSpacing, relativeTo: style.relativeTo)
    _tracking = ScaledMetric(wrappedValue: style.tracking, relativeTo: style.relativeTo)
  }

  func body(content: Content) -> some View {
    content.font(style.font).lineSpacing(lineSpacing).tracking(tracking)
  }
}

public extension View {
  /// Applies a Flint type style: font, line spacing and tracking, all scaled with Dynamic Type.
  func flintText(_ style: FlintTextStyle) -> some View { modifier(FlintTextModifier(style: style)) }
}

extension Color {
  init(flintHex hex: UInt32, opacity: Double = 1) {
    self.init(.sRGB, red: Double((hex >> 16) & 0xff) / 255, green: Double((hex >> 8) & 0xff) / 255, blue: Double(hex & 0xff) / 255, opacity: opacity)
  }
}

private func dynamic(light: UInt32, lightOpacity: Double = 1, dark: UInt32, darkOpacity: Double = 1) -> Color {
  func rgb(_ h: UInt32) -> (CGFloat, CGFloat, CGFloat) { (CGFloat((h >> 16) & 0xff) / 255, CGFloat((h >> 8) & 0xff) / 255, CGFloat(h & 0xff) / 255) }
  let l = rgb(light), d = rgb(dark)
  #if canImport(UIKit)
  return Color(uiColor: UIColor { traits in
    traits.userInterfaceStyle == .dark
      ? UIColor(red: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : UIColor(red: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #elseif canImport(AppKit)
  return Color(nsColor: NSColor(name: nil) { appearance in
    appearance.bestMatch(from: [.darkAqua, .aqua]) == .darkAqua
      ? NSColor(srgbRed: d.0, green: d.1, blue: d.2, alpha: darkOpacity)
      : NSColor(srgbRed: l.0, green: l.1, blue: l.2, alpha: lightOpacity)
  })
  #else
  return Color(flintHex: light, opacity: lightOpacity)
  #endif
}
