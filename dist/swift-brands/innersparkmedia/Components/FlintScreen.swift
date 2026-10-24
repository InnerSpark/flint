// GENERATED copy of swift/Components/FlintScreen.swift. Edit the source, not this file.
import SwiftUI

/// A scrolling page: the page background, standard insets, a navigation title. Use inside a
/// NavigationStack. `largeTitle: false` gives the inline title for screens deeper in the stack.
public struct FlintScreen<Content: View>: View {
  let title: String
  let largeTitle: Bool
  let content: Content

  public init(_ title: String, largeTitle: Bool = true, @ViewBuilder content: () -> Content) {
    self.title = title
    self.largeTitle = largeTitle
    self.content = content()
  }

  public var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: Flint.Space.s24) { content }
        .padding(.horizontal, Flint.Space.s16)
        .padding(.top, Flint.Space.s8)
        .padding(.bottom, Flint.Space.s24)
    }
    .background(Flint.Colors.surfacePage.ignoresSafeArea())
    .navigationTitle(title)
    #if os(iOS)
    .navigationBarTitleDisplayMode(largeTitle ? .large : .inline)
    #endif
  }
}
