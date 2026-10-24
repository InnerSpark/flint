// GENERATED copy of swift/Components/FlintChrome.swift. Edit the source, not this file.
import SwiftUI
#if os(iOS)
import UIKit

/// Styles Apple's own navigation bars, tab bars, toolbars and alerts with Flint colors and type.
/// Call once at launch: `init() { FlintChrome.apply() }` in your App. The bars stay native, so
/// VoiceOver, the large content viewer, iPad sidebars and the system look keep working.
public enum FlintChrome {
  @MainActor public static func apply() {
    navigationBars()
    tabBars()
    toolbars()
    // Alert and confirmation dialog buttons follow the app tint; destructive actions stay system red.
    UIView.appearance(whenContainedInInstancesOf: [UIAlertController.self]).tintColor = Flint.UIColors.actionPrimary
  }

  /// Large title on the page background at the top; a solid bar with a hairline once content scrolls under it.
  @MainActor public static func navigationBars() {
    let large: [NSAttributedString.Key: Any] = [.font: Flint.Typography.navTitleLarge.uiFont, .foregroundColor: Flint.UIColors.textHeading]
    let inline: [NSAttributedString.Key: Any] = [.font: Flint.Typography.navTitle.uiFont, .foregroundColor: Flint.UIColors.textHeading]

    let top = UINavigationBarAppearance()
    top.configureWithTransparentBackground()
    top.backgroundColor = Flint.UIColors.surfacePage
    top.largeTitleTextAttributes = large
    top.titleTextAttributes = inline

    let scrolled = UINavigationBarAppearance()
    scrolled.configureWithOpaqueBackground()
    scrolled.backgroundColor = Flint.UIColors.surfaceDefault
    scrolled.shadowColor = Flint.UIColors.borderDefault
    scrolled.largeTitleTextAttributes = large
    scrolled.titleTextAttributes = inline

    let bar = UINavigationBar.appearance()
    bar.scrollEdgeAppearance = top
    bar.standardAppearance = scrolled
    bar.compactAppearance = scrolled
    bar.tintColor = Flint.UIColors.actionPrimary
  }

  /// Tab bar on the default surface with a hairline. Unselected items use muted text, the selected
  /// item the primary action color; both carry a label, so selection never rests on color alone.
  @MainActor public static func tabBars() {
    let font = Flint.Typography.tabLabel.uiFont
    let item = UITabBarItemAppearance()
    item.normal.iconColor = Flint.UIColors.textMuted
    item.normal.titleTextAttributes = [.font: font, .foregroundColor: Flint.UIColors.textMuted]
    item.selected.iconColor = Flint.UIColors.actionPrimary
    item.selected.titleTextAttributes = [.font: font, .foregroundColor: Flint.UIColors.actionPrimary]
    item.normal.badgeBackgroundColor = Flint.UIColors.feedbackErrorSolid
    item.normal.badgeTextAttributes = [.foregroundColor: Flint.UIColors.feedbackErrorOnSolid]

    let tabs = UITabBarAppearance()
    tabs.configureWithOpaqueBackground()
    tabs.backgroundColor = Flint.UIColors.surfaceDefault
    tabs.shadowColor = Flint.UIColors.borderDefault
    tabs.stackedLayoutAppearance = item
    tabs.inlineLayoutAppearance = item
    tabs.compactInlineLayoutAppearance = item

    let bar = UITabBar.appearance()
    bar.standardAppearance = tabs
    bar.scrollEdgeAppearance = tabs
    bar.tintColor = Flint.UIColors.actionPrimary
  }

  /// Bottom toolbar, matching the scrolled navigation bar.
  @MainActor public static func toolbars() {
    let tools = UIToolbarAppearance()
    tools.configureWithOpaqueBackground()
    tools.backgroundColor = Flint.UIColors.surfaceDefault
    tools.shadowColor = Flint.UIColors.borderDefault
    let bar = UIToolbar.appearance()
    bar.standardAppearance = tools
    bar.compactAppearance = tools
    bar.scrollEdgeAppearance = tools
    bar.tintColor = Flint.UIColors.actionPrimary
  }
}

public extension FlintTextStyle {
  /// The style as a UIFont scaled for the current Dynamic Type size, for UIKit APIs.
  var uiFont: UIFont {
    let base = UIFont(name: fontName, size: size) ?? .systemFont(ofSize: size)
    return UIFontMetrics(forTextStyle: Self.uiTextStyle(relativeTo)).scaledFont(for: base)
  }

  private static func uiTextStyle(_ style: Font.TextStyle) -> UIFont.TextStyle {
    switch style {
    case .largeTitle: return .largeTitle
    case .title: return .title1
    case .title2: return .title2
    case .title3: return .title3
    case .headline: return .headline
    case .subheadline: return .subheadline
    case .callout: return .callout
    case .footnote: return .footnote
    case .caption: return .caption1
    case .caption2: return .caption2
    default: return .body
    }
  }
}
#endif
