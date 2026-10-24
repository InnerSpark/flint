import SwiftUI

/// Minus, value, plus with large round buttons, and one VoiceOver element you swipe up or down
/// to adjust. Shows the requested value at once and drops it when the bound value changes, so a
/// slow device never makes the number jump back.
public struct FlintStepper: View {
  let label: String
  @Binding var value: Int
  let range: ClosedRange<Int>
  let step: Int
  let display: (Int) -> String
  let spoken: (Int) -> String
  var disabledReason: String?

  @State private var pending: Int?
  @ScaledMetric(relativeTo: .title) private var buttonSize: CGFloat = 56
  @Environment(\.dynamicTypeSize) private var typeSize
  @Environment(\.isEnabled) private var isEnabled

  /// `display` is the visual text ("72°"); `spoken` is what VoiceOver says ("72 degrees").
  public init(_ label: String, value: Binding<Int>, in range: ClosedRange<Int>, step: Int = 1,
              display: @escaping (Int) -> String = { "\($0)" }, spoken: @escaping (Int) -> String = { "\($0)" },
              disabledReason: String? = nil) {
    self.label = label
    self._value = value
    self.range = range
    self.step = step
    self.display = display
    self.spoken = spoken
    self.disabledReason = disabledReason
  }

  private var current: Int { pending ?? value }
  private var side: CGFloat { min(max(buttonSize, Flint.Target.minimum), 72) }

  public var body: some View {
    Group {
      if typeSize.isAccessibilitySize {
        VStack(spacing: Flint.Space.s12) {
          number
          HStack(spacing: Flint.Space.s24) { minus; plus }
        }
      } else {
        HStack(spacing: Flint.Space.s16) { minus; number; plus }
      }
    }
    .onChange(of: value) { _ in pending = nil }
    .accessibilityRepresentation {
      Stepper(label, value: Binding(get: { current }, set: { set($0) }), in: range, step: step)
        .accessibilityValue(spoken(current))
        .accessibilityHint(!isEnabled ? (disabledReason ?? "") : "")
    }
  }

  private var number: some View {
    Text(display(current))
      .flintText(Flint.Typography.headingH1)
      .foregroundStyle(isEnabled ? Flint.Colors.textHeading : Flint.Colors.actionDisabled)
      .monospacedDigit()
      .lineLimit(1)
      .minimumScaleFactor(0.6)
      .frame(maxWidth: .infinity)
      .contentTransition(.numericText())
  }

  private var minus: some View { button("minus", enabled: current - step >= range.lowerBound) { set(current - step) } }
  private var plus: some View { button("plus", enabled: current + step <= range.upperBound) { set(current + step) } }

  private func set(_ new: Int) {
    let clamped = min(range.upperBound, max(range.lowerBound, new))
    guard clamped != current else { return }
    pending = clamped
    value = clamped
  }

  private func button(_ symbol: String, enabled: Bool, action: @escaping () -> Void) -> some View {
    Button(action: action) {
      Image(systemName: symbol)
        .font(.title2.weight(.semibold))
        .frame(width: side, height: side)
        .contentShape(Circle())
    }
    .buttonStyle(CircleStyle())
    .disabled(!enabled)
  }

  private struct CircleStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View { Body(configuration: configuration) }
    private struct Body: View {
      let configuration: ButtonStyleConfiguration
      @Environment(\.isEnabled) private var isEnabled
      var body: some View {
        configuration.label
          .foregroundStyle(isEnabled ? Flint.Colors.actionPrimary : Flint.Colors.actionDisabled)
          .background(Circle().fill(configuration.isPressed ? Flint.Colors.surfaceSubtle : Flint.Colors.surfaceDefault))
          .overlay(Circle().strokeBorder(isEnabled ? Flint.Colors.borderControl : Flint.Colors.borderDisabled, lineWidth: 1))
      }
    }
  }
}
