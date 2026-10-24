// GENERATED copy of swift/Components/FlintTone.swift. Edit the source, not this file.
import SwiftUI

/// The feedback families notices and tags share. Every tone pairs its color with an icon and words,
/// so nothing depends on color alone.
public enum FlintTone: Sendable {
  case neutral, info, success, warning, error

  var surface: Color {
    switch self {
    case .neutral: return Flint.Colors.surfaceSubtle
    case .info: return Flint.Colors.feedbackInfoSurface
    case .success: return Flint.Colors.feedbackSuccessSurface
    case .warning: return Flint.Colors.feedbackWarningSurface
    case .error: return Flint.Colors.feedbackErrorSurface
    }
  }

  var border: Color {
    switch self {
    case .neutral: return Flint.Colors.borderDefault
    case .info: return Flint.Colors.feedbackInfoBorder
    case .success: return Flint.Colors.feedbackSuccessBorder
    case .warning: return Flint.Colors.feedbackWarningBorder
    case .error: return Flint.Colors.feedbackErrorBorder
    }
  }

  var text: Color {
    switch self {
    case .neutral: return Flint.Colors.textDefault
    case .info: return Flint.Colors.feedbackInfoText
    case .success: return Flint.Colors.feedbackSuccessText
    case .warning: return Flint.Colors.feedbackWarningText
    case .error: return Flint.Colors.feedbackErrorText
    }
  }

  /// SF Symbol shown with the tone.
  var symbol: String {
    switch self {
    case .neutral: return "circle"
    case .info: return "info.circle.fill"
    case .success: return "checkmark.circle.fill"
    case .warning: return "exclamationmark.triangle.fill"
    case .error: return "xmark.octagon.fill"
    }
  }
}
