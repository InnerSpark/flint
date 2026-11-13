// GENERATED copy of swift/Components/FlintSlider.swift. Edit the source, not this file.
import SwiftUI

/// A value you drag across a range: a label, the current value, Apple's slider in Flint colors and
/// an optional caption. VoiceOver hears one adjustable element and swipes up or down by `step`.
/// Use it where an exact number matters less than the feel: brightness, volume, speed.
public struct FlintSlider: View {
  let label: String
  @Binding var value: Double
  let range: ClosedRange<Double>
  let step: Double
  let display: (Double) -> String
  let spoken: (Double) -> String
  let caption: String?
  var disabledReason: String?
  var onEditingChanged: (Bool) -> Void
  @Environment(\.isEnabled) private var isEnabled

  /// `step` sets both the drag snapping (when `snaps` is true) and the VoiceOver adjustment.
  /// `onEditingChanged` reports drag start and end, so a slow device can send once on release.
  public init(_ label: String, value: Binding<Double>, in range: ClosedRange<Double>, step: Double,
              snaps: Bool = false, caption: String? = nil, disabledReason: String? = nil,
              display: @escaping (Double) -> String, spoken: @escaping (Double) -> String,
              onEditingChanged: @escaping (Bool) -> Void = { _ in }) {
    self.label = label
    self._value = value
    self.range = range
    self.step = step
    self.snaps = snaps
    self.caption = caption
    self.disabledReason = disabledReason
    self.display = display
    self.spoken = spoken
    self.onEditingChanged = onEditingChanged
  }

  let snaps: Bool

  public var body: some View {
    VStack(alignment: .leading, spacing: Flint.Space.s8) {
      HStack(alignment: .firstTextBaseline) {
        Text(label)
          .flintText(Flint.Typography.labelDefault)
          .foregroundStyle(isEnabled ? Flint.Colors.textDefault : Flint.Colors.actionDisabled)
        Spacer()
        Text(display(value))
          .flintText(Flint.Typography.headingH3)
          .foregroundStyle(isEnabled ? Flint.Colors.textHeading : Flint.Colors.actionDisabled)
          .monospacedDigit()
      }
      .accessibilityHidden(true)
      slider
        .tint(Flint.Colors.actionPrimary)
        .frame(minHeight: Flint.Target.minimum)
        .accessibilityLabel(label)
        .accessibilityValue(spoken(value))
        .accessibilityHint(!isEnabled ? (disabledReason ?? "") : (caption ?? ""))
        .accessibilityAdjustableAction { direction in
          switch direction {
          case .increment: set(value + step)
          case .decrement: set(value - step)
          @unknown default: return
          }
        }
      if let note = !isEnabled ? (disabledReason ?? caption) : caption {
        Text(note)
          .flintText(Flint.Typography.labelCaption)
          .foregroundStyle(Flint.Colors.textMuted)
          .fixedSize(horizontal: false, vertical: true)
          .accessibilityHidden(true)
      }
    }
  }

  @ViewBuilder private var slider: some View {
    if snaps {
      Slider(value: $value, in: range, step: step, onEditingChanged: onEditingChanged)
    } else {
      Slider(value: $value, in: range, onEditingChanged: onEditingChanged)
    }
  }

  /// VoiceOver changes commit at once, like a finished drag.
  private func set(_ new: Double) {
    value = min(range.upperBound, max(range.lowerBound, new))
    onEditingChanged(false)
  }
}
