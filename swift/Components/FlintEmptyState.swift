import SwiftUI

/// Shown when there's nothing here yet: what happened, what to do, and one way forward.
/// Steps are optional and read as "Step 1. ...".
public struct FlintEmptyState<Action: View>: View {
  let title: String
  let systemImage: String
  let message: String
  let steps: [String]
  let action: Action

  public init(_ title: String, systemImage: String, message: String, steps: [String] = [], @ViewBuilder action: () -> Action) {
    self.title = title
    self.systemImage = systemImage
    self.message = message
    self.steps = steps
    self.action = action()
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: Flint.Space.s12) {
      Label(title, systemImage: systemImage)
        .flintText(Flint.Typography.headingH3)
        .foregroundStyle(Flint.Colors.textHeading)
        .accessibilityAddTraits(.isHeader)
      Text(message)
        .flintText(Flint.Typography.bodySm)
        .foregroundStyle(Flint.Colors.textDefault)
        .fixedSize(horizontal: false, vertical: true)
      ForEach(Array(steps.enumerated()), id: \.offset) { i, step in
        HStack(alignment: .firstTextBaseline, spacing: Flint.Space.s8) {
          Text("\(i + 1).")
            .flintText(Flint.Typography.labelDefault)
            .foregroundStyle(Flint.Colors.textMuted)
          Text(step)
            .flintText(Flint.Typography.bodySm)
            .foregroundStyle(Flint.Colors.textDefault)
            .fixedSize(horizontal: false, vertical: true)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Step \(i + 1). \(step)")
      }
      action
    }
    .flintCard()
  }
}

public extension FlintEmptyState where Action == EmptyView {
  init(_ title: String, systemImage: String, message: String, steps: [String] = []) {
    self.init(title, systemImage: systemImage, message: message, steps: steps) { EmptyView() }
  }
}
