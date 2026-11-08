// GENERATED copy of swift/Components/FlintStatTile.swift. Edit the source, not this file.
import SwiftUI

/// One reading: an icon, a title, a big value and an optional detail. The visual and spoken values
/// are separate, so VoiceOver hears "1,240 watts", not "1.24 kW".
public struct FlintStatTile: View {
  let title: String
  let systemImage: String
  let value: String
  let detail: String?
  let spokenValue: String
  let opensDetail: Bool
  @ScaledMetric(relativeTo: .body) private var iconSize: CGFloat = 32

  /// `opensDetail` shows a chevron; wrap the tile in a NavigationLink and add a hint.
  public init(_ title: String, systemImage: String, value: String, detail: String? = nil, spokenValue: String? = nil, opensDetail: Bool = false) {
    self.title = title
    self.systemImage = systemImage
    self.value = value
    self.detail = detail
    self.spokenValue = spokenValue ?? value
    self.opensDetail = opensDetail
  }

  public var body: some View {
    VStack(alignment: .leading, spacing: Flint.Space.s12) {
      HStack(spacing: Flint.Space.s8) {
        Image(systemName: systemImage)
          .font(.subheadline.weight(.semibold))
          .foregroundStyle(Flint.Colors.selectedText)
          .frame(width: iconSize, height: iconSize)
          .background(Flint.Colors.selectedSurface, in: Circle())
        Text(title)
          .flintText(Flint.Typography.labelDefault)
          .foregroundStyle(Flint.Colors.textMuted)
        if opensDetail {
          Spacer(minLength: 0)
          Image(systemName: "chevron.right")
            .font(.footnote.weight(.semibold))
            .foregroundStyle(Flint.Colors.textMuted)
        }
      }
      VStack(alignment: .leading, spacing: Flint.Space.s2) {
        Text(value)
          .flintText(Flint.Typography.headingH2)
          .foregroundStyle(Flint.Colors.textHeading)
          .monospacedDigit()
        if let detail {
          Text(detail)
            .flintText(Flint.Typography.bodySm)
            .foregroundStyle(Flint.Colors.textMuted)
        }
      }
    }
    .flintCard()
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(title)
    .accessibilityValue(spokenValue)
  }
}
