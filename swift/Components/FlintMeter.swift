import SwiftUI

/// A level you read at a glance: a label, the value in words, and a bar. The tone says whether the
/// level needs action (a waste tank nearly full, a battery nearly empty), and the words always say
/// it too, so the meaning never rests on the bar's color.
public struct FlintMeter: View {
  /// How the level reads. `.normal` uses the primary action color; the feedback tones are for levels
  /// that need attention.
  public enum Tone: Sendable {
    case normal, success, warning, error

    var fill: Color {
      switch self {
      case .normal: return Flint.Colors.actionPrimary
      case .success: return Flint.Colors.feedbackSuccessSolid
      case .warning: return Flint.Colors.feedbackWarningSolid
      case .error: return Flint.Colors.feedbackErrorSolid
      }
    }

    var text: Color {
      switch self {
      case .normal: return Flint.Colors.textHeading
      case .success: return Flint.Colors.feedbackSuccessText
      case .warning: return Flint.Colors.feedbackWarningText
      case .error: return Flint.Colors.feedbackErrorText
      }
    }
  }

  let label: String
  let fraction: Double
  let valueText: String
  let spokenValue: String?
  let detail: String?
  let tone: Tone
  @ScaledMetric(relativeTo: .body) private var barHeight: CGFloat = 8

  /// `fraction` is 0 to 1. `valueText` is what shows ("85%, dump soon"); `spokenValue` replaces it
  /// for VoiceOver when the shown text has symbols or units.
  public init(_ label: String, fraction: Double, valueText: String, spokenValue: String? = nil,
              detail: String? = nil, tone: Tone = .normal) {
    self.label = label
    self.fraction = fraction
    self.valueText = valueText
    self.spokenValue = spokenValue
    self.detail = detail
    self.tone = tone
  }

  private var clamped: Double { min(1, max(0, fraction.isFinite ? fraction : 0)) }

  public var body: some View {
    VStack(alignment: .leading, spacing: Flint.Space.s8) {
      HStack(alignment: .firstTextBaseline, spacing: Flint.Space.s8) {
        Text(label)
          .flintText(Flint.Typography.labelDefault)
          .foregroundStyle(Flint.Colors.textDefault)
        Spacer(minLength: Flint.Space.s8)
        Text(valueText)
          .flintText(Flint.Typography.labelDefault)
          .foregroundStyle(tone.text)
          .monospacedDigit()
          .multilineTextAlignment(.trailing)
      }
      GeometryReader { geo in
        ZStack(alignment: .leading) {
          Capsule().fill(Flint.Colors.surfaceSubtle)
          Capsule().fill(tone.fill)
            .frame(width: clamped == 0 ? 0 : max(barHeight, geo.size.width * clamped))
        }
      }
      .frame(height: barHeight)
      if let detail {
        Text(detail)
          .flintText(Flint.Typography.labelCaption)
          .foregroundStyle(Flint.Colors.textMuted)
          .fixedSize(horizontal: false, vertical: true)
      }
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(label)
    .accessibilityValue([spokenValue ?? valueText, detail].compactMap { $0 }.joined(separator: ". "))
  }
}
