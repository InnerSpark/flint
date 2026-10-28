// iOS component pages (ASDS-87). Each entry drives /components/ios/<slug>/: an HTML stand-in for the
// SwiftUI component (drawn from the iOS platform tokens in styles/ios.css), its SwiftUI code and its
// accessibility behavior. "__P__" in markup is replaced per preview so ids stay unique.

const path = {
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="0.6"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  error: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="m9 9 6 6M15 9l-6 6"/>',
  battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M5 10h9v4H5z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
  share: '<path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
};
export const icon = (name) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path[name]}</svg>`;

const status = '<div class="ios-status" aria-hidden="true"><span>9:41</span><span class="ios-island"></span><svg viewBox="0 0 44 12"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="1" width="3" height="11" rx="1"/><rect x="23" y="1.5" width="18" height="9" rx="2.5" fill="none" stroke="currentColor"/><rect x="25" y="3.5" width="12" height="5" rx="1"/></svg></div>';
const home = '<span class="ios-home" aria-hidden="true"></span>';
/** A full screen: status bar, optional nav bar, body, optional bottom bar, home indicator. */
export const screen = ({ nav = '', body, bottom = '' }) => `${status}${nav}<div class="ios-body">${body}</div>${bottom}${home}`;

const tabbar = (selected = 0, badge = false) => `<div class="ios-tabbar" role="tablist" aria-label="Tabs">${[['map', 'Trips'], ['bolt', 'Power'], ['gear', 'Settings']].map(([i, l], n) =>
  `<button type="button" role="tab" class="ios-tab" aria-selected="${n === selected}" tabindex="${n === selected ? 0 : -1}">${icon(i)}<span>${l}</span>${badge && n === 2 ? '<span class="ios-badge" aria-hidden="true">1</span><span class="flint-sr-only">, 1 new</span>' : ''}</button>`).join('')}</div>`;
const navInline = (title, back = '', trailing = '') => `<div class="ios-navbar">${back ? `<button type="button" class="ios-bar-btn">${icon('back')}${back}</button>` : '<span></span>'}<p class="ios-navbar-title">${title}</p>${trailing}</div>`;


// Content for the glass previews: photo cards scroll under the floating bars.
const trips = (n = 3) => [['Big Bend', 'March 14 to 18', ''], ['Guadalupe Mountains', 'April 2 to 4', ' ios-photo--b'], ['Enchanted Rock', 'May 10 to 11', '']].slice(0, n)
  .map(([t, d, v]) => `<div class="ios-trip"><div class="ios-photo${v}" aria-hidden="true"></div><div class="ios-card ios-card--photo"><p class="ios-h3">${t}</p><p class="ios-muted">${d}</p></div></div>`).join('');
const glassNav = (title, trailing = '') => `<div class="ios-navbar"><span></span><p class="ios-navbar-title">${title}</p>${trailing}</div>`;

export const IOS = {
  'tab-bar': {
    glass: screen({ nav: glassNav('Trips', `<button type="button" class="ios-bar-btn" aria-label="New trip">${icon('plus')}</button>`), body: trips(), bottom: tabbar(0, true) }),
    glassNote: 'On iOS 26 and later the tab bar floats over the content as Liquid Glass and can shrink as you scroll down (`.tabBarMinimizeBehavior(.onScrollDown)`). FlintChrome sets only the selected tint; the system keeps the glass.',
    name: 'Tab bar', swift: 'FlintChrome.apply()', lead: "Apple's own tab bar, styled once at launch. It holds the main places in the app, one tap away.",
    web: 'tabs',
    preview: screen({ nav: navInline('Trips'), body: '<p class="ios-sm">Three to five tabs, each a place in the app. Every tab has an icon and a label.</p>', bottom: tabbar(0, true) }),
    when: ['Three to five top-level places the person moves between often.', 'Each tab keeps its own navigation stack, so switching back returns where they were.'],
    not: ['Actions such as Add or Share. Those go in the navigation bar or a toolbar.', 'More than five places. The sixth hides behind More, which few people find.'],
    code: `@main
struct TripsApp: App {
  init() { FlintChrome.apply() }   // once, at launch

  var body: some Scene {
    WindowGroup {
      TabView {
        NavigationStack { TripsView() }
          .tabItem { Label("Trips", systemImage: "map") }
        NavigationStack { PowerView() }
          .tabItem { Label("Power", systemImage: "bolt") }
        NavigationStack { SettingsView() }
          .tabItem { Label("Settings", systemImage: "gear") }
          .badge(1)
      }
      .tint(Flint.Colors.actionPrimary)
    }
  }
}`,
    a11y: ['VoiceOver reads "Trips, tab, 1 of 3, selected". The label carries selection, not the color.', 'Long-press a tab at large text sizes to see it in the large content viewer. That only works because the bar stays native.', 'Badges are read with the tab ("Settings, 1 new item").', 'Unselected tabs use the muted text color (over 7:1); the selected tab uses the primary action color.'],
  },
  'navigation-bar': {
    glass: screen({ nav: glassNav('Trips', `<button type="button" class="ios-bar-btn">Edit</button>`), body: trips() }),
    glassNote: 'On iOS 26 and later the bar has no background. Content scrolls under it behind a soft edge effect, and bar buttons sit on their own glass. FlintChrome sets only the title fonts.',
    name: 'Navigation bar', swift: 'FlintChrome.apply()', lead: 'The big title at the top of a screen. It shrinks to a small one as you scroll.',
    preview: screen({ nav: navInline('', '', `<button type="button" class="ios-bar-btn">Edit</button>`), body: '<h2 class="ios-large-title">Trips</h2><p class="ios-sm">The large title uses navTitleLarge (34). Scrolled, the bar turns solid with a hairline and shows navTitle (17).</p><div class="ios-card"><p class="ios-h3">Big Bend</p><p class="ios-muted">March 14 to 18</p></div>' }),
    previewScrolled: screen({ nav: navInline('Big Bend', 'Trips', '<button type="button" class="ios-bar-btn" aria-label="Share">' + icon('share') + '</button>'), body: '<p class="ios-sm">Deeper screens use the inline title and a back button that names the screen it returns to.</p>' }),
    when: ['Every screen inside a NavigationStack.', 'Large titles on the first screen of each tab; inline titles deeper in.'],
    not: ['A custom header view in place of the bar. It loses the back gesture, VoiceOver headings and the large content viewer.'],
    code: `FlintScreen("Trips") {          // large title
  ...
}

FlintScreen("Big Bend", largeTitle: false) {  // inline, deeper in the stack
  ...
}
.toolbar {
  ShareLink(item: tripURL) { Label("Share", systemImage: "square.and.arrow.up") }
}`,
    a11y: ['The title is the screen\'s heading, so VoiceOver announces it when the screen opens.', 'Icon-only bar buttons need a label: "Share", not "square.and.arrow.up".', 'The back button reads the previous screen\'s name.'],
  },
  toolbar: {
    glass: screen({ nav: glassNav('Big Bend'), body: trips(2), bottom: `<div class="ios-toolbar"><button type="button" class="ios-bar-btn">${icon('share')}<span class="flint-sr-only">Share</span></button><button type="button" class="ios-bar-btn">${icon('trash')}<span class="flint-sr-only">Delete trip</span></button></div>` }),
    glassNote: 'On iOS 26 and later the toolbar floats as a glass capsule. Use `ToolbarSpacer` to split it into groups.',
    name: 'Toolbar', swift: 'FlintChrome.apply()', lead: 'A row of actions along the bottom of a screen, for screens that have no tab bar.',
    preview: screen({ nav: navInline('Big Bend', 'Trips'), body: '<p class="ios-sm">Actions for this screen sit within thumb reach. Use a toolbar when there is no tab bar on the screen.</p>', bottom: `<div class="ios-toolbar"><button type="button" class="ios-bar-btn">${icon('share')}<span class="flint-sr-only">Share</span></button><button type="button" class="ios-bar-btn">${icon('trash')}<span class="flint-sr-only">Delete trip</span></button></div>` }),
    when: ['Two to five actions for the current screen, on screens without a tab bar.'],
    not: ['Navigation between places. That is the tab bar.'],
    code: `.toolbar {
  ToolbarItemGroup(placement: .bottomBar) {
    ShareLink(item: tripURL) { Label("Share", systemImage: "square.and.arrow.up") }
    Spacer()
    Button(role: .destructive) { confirmDelete = true } label: { Label("Delete trip", systemImage: "trash") }
  }
}`,
    a11y: ['Each icon button carries a Label, so VoiceOver reads the words even when only the icon shows.', 'Targets are at least 44 by 44pt.'],
  },
  list: {
    name: 'List rows', swift: '.flintList(), FlintRow', lead: 'Grouped lists like the Settings app. A row can show a value, open another screen or run an action.',
    preview: screen({ nav: navInline('Settings'), body: `<section class="ios-section" aria-labelledby="__P__-conn"><h3 class="ios-section-header" id="__P__-conn">Connections</h3><ul class="ios-group"><li><button type="button" class="ios-row"><span class="ios-row-icon">${icon('wifi')}</span><span class="ios-row-text">Wi-Fi</span><span class="ios-row-value">Trailer-5G</span><span class="ios-row-chev">${icon('chevron')}</span></button></li><li><button type="button" class="ios-row"><span class="ios-row-icon">${icon('server')}</span><span class="ios-row-text"><span>Cerbo</span><span class="ios-muted">192.168.1.20</span></span><span class="ios-row-chev">${icon('chevron')}</span></button></li></ul></section><section class="ios-section" aria-label="Trip actions"><ul class="ios-group"><li><button type="button" class="ios-row ios-row--danger">Delete trip</button></li></ul></section>` }),
    when: ['Settings, details and anything that reads as label and value.', 'Rows that open a deeper screen (NavigationLink adds the chevron).'],
    not: ['Cards of content with their own layout. Use FlintScreen with cards.'],
    code: `List {
  Section {
    NavigationLink { WifiView() } label: {
      FlintRow("Wi-Fi", value: "Trailer-5G", systemImage: "wifi")
    }
    FlintRow("Cerbo", subtitle: "192.168.1.20", systemImage: "server.rack")
  } header: {
    FlintListHeader("Connections")
  }
  Section {
    FlintRowButton("Delete trip", role: .destructive) { confirmDelete = true }
  }
}
.flintList()`,
    a11y: ['Each row is one VoiceOver element: "Wi-Fi, Trailer-5G, button".', 'At accessibility text sizes the value moves under the title and the icon drops, so nothing truncates. See the third preview.', 'Section headers are headings, so the rotor jumps between them.', 'Destructive rows say what they destroy ("Delete trip", not "Delete") and use the danger color plus words.'],
  },
  sheet: {
    glass: screen({ nav: glassNav('Trips'), body: trips(2) }).replace('<span class="ios-home"', `<div class="ios-sheet" role="dialog" aria-modal="true" aria-labelledby="__P__-gsheet"><span class="ios-grabber" aria-hidden="true"></span><div class="ios-sheet-head"><h2 class="ios-h2" id="__P__-gsheet">New trip</h2><button type="button" class="ios-bar-btn ios-glass" aria-label="Close">${icon('close')}</button></div><div class="ios-sheet-body"><p class="ios-sm">Where are you headed?</p><button type="button" class="flint-btn flint-btn--primary ios-full">Plan trip</button></div></div><span class="ios-home"`),
    glassNote: 'On iOS 26 and later a sheet at medium height floats inset from the screen edges as Liquid Glass, and turns solid as it grows to full height. `.flintSheet()` leaves its background and corners to the system there.',
    name: 'Sheet', swift: '.flintSheet(), FlintSheetHeader', lead: 'A task that slides up over the current screen. It has a grab handle and a Close button.',
    preview: screen({ nav: navInline('Trips'), body: '<h2 class="ios-large-title">Trips</h2><div class="ios-card"><p class="ios-h3">Big Bend</p></div>' }).replace('<span class="ios-home"', `<div class="ios-scrim" aria-hidden="true"></div><div class="ios-sheet" role="dialog" aria-modal="true" aria-labelledby="__P__-sheet"><span class="ios-grabber" aria-hidden="true"></span><div class="ios-sheet-head"><h2 class="ios-h2" id="__P__-sheet">New trip</h2><button type="button" class="ios-bar-btn" aria-label="Close">${icon('close')}</button></div><div class="ios-sheet-body"><p class="ios-sm">Where are you headed?</p><button type="button" class="flint-btn flint-btn--primary ios-full">Plan trip</button></div></div><span class="ios-home"`),
    when: ['A short task that keeps the screen behind it in context: create, edit, filter.', 'Medium height for quick tasks; let it grow to large for forms.'],
    not: ['A decision with destructive results. Use a confirmation dialog.', 'Long flows of several screens. Push them in a NavigationStack inside the sheet.'],
    code: `.sheet(isPresented: $showNewTrip) {
  VStack(alignment: .leading, spacing: Flint.Space.s12) {
    FlintSheetHeader("New trip") { showNewTrip = false }
    NewTripForm()
  }
  .flintSheet(detents: [.medium, .large])
}`,
    a11y: ['Focus moves into the sheet and stays there until it closes; VoiceOver reads the title first.', 'Always show a Close button. Not everyone can swipe down, and the grab handle is not a button.', 'Escape on a hardware keyboard closes it, and focus returns to the control that opened it.'],
  },
  'glass-button': {
    name: 'Glass button', swift: '.flintGlassButton()', lead: 'Buttons that float over content. On iOS 26 and later they are Liquid Glass; before that, they are regular Flint buttons.',
    preview: screen({ body: trips(2) + '<div class="ios-row-actions"><button type="button" class="flint-btn flint-btn--secondary">Locate</button><button type="button" class="flint-btn flint-btn--primary">Start trip</button></div>' }),
    glass: screen({ body: trips(3) }).replace('<span class="ios-home"', `<div class="ios-float"><button type="button" class="ios-glass">${icon('map')}Locate</button><button type="button" class="ios-glass ios-glass--prominent">Start trip</button></div><span class="ios-home"`),
    glassNote: 'iOS 26 and later use Apple\'s `.glass` and `.glassProminent` button styles tinted with the primary action color. The prominent label uses the on-primary color, so it keeps Flint\'s contrast in dark mode.',
    when: ['Controls that float over content the person is looking at: Locate on a map, playback controls, a Start button over a route.'],
    not: ['Buttons inside content, such as forms, cards and notices. Glass is for the navigation layer; use `.buttonStyle(.flint(...))` there.', 'Stacking glass on glass. Group nearby glass buttons in a `GlassEffectContainer` so they render as one.'],
    code: `ZStack(alignment: .bottomTrailing) {
  RouteMap()
  HStack {
    Button("Locate", systemImage: "location") { locate() }
      .flintGlassButton()
    Button("Start trip") { start() }
      .flintGlassButton(prominent: true)
  }
  .padding(Flint.Space.s16)
}`,
    a11y: ['Reduce Transparency turns the glass solid; Increase Contrast adds a stronger edge. Both come from the system.', 'iOS 26.1 added a Clear and Tinted setting for Liquid Glass (Settings, Display and Brightness, Liquid Glass). Native glass follows it with no app code.', 'Before iOS 26 the same call draws Flint\'s secondary and primary buttons.'],
  },
  button: {
    name: 'Button', swift: 'FlintButtonStyle', lead: 'Primary, secondary, danger and text buttons from the button tokens, 44pt tall on iOS.',
    web: 'button',
    preview: screen({ body: '<button type="button" class="flint-btn flint-btn--primary ios-full">Start trip</button><button type="button" class="flint-btn flint-btn--secondary ios-full">Share route</button><button type="button" class="flint-btn flint-btn--danger ios-full">Delete trip</button><button type="button" class="flint-btn flint-btn--text ios-full">Skip</button><button type="button" class="flint-btn flint-btn--primary ios-full" disabled>Saving</button>' }),
    when: ['Primary: the one main action on a screen.', 'Secondary: other actions next to it.', 'Danger: actions that destroy something.', 'Text: low-emphasis actions such as Skip.'],
    not: ['More than one primary button in view.'],
    code: `Button("Start trip") { start() }
  .buttonStyle(.flint(.primary, fullWidth: true))

Button("Share route") { share() }.buttonStyle(.flint(.secondary))
Button("Delete trip", role: .destructive) { confirm() }.buttonStyle(.flint(.danger))
Button("Skip") { skip() }.buttonStyle(.flint(.text))`,
    a11y: ['44pt minimum height on iOS from the platform tokens.', 'Labels wrap instead of truncating at large text sizes.', 'Pressed and disabled states change the fill, not only the opacity. Disabled buttons are read as "dimmed".'],
  },
  notice: {
    name: 'Notice', swift: 'FlintNotice', lead: 'A message on a tinted background: info, success, warning or error. It can have a title and actions.',
    web: 'alert',
    preview: screen({ body: `<div class="ios-notice ios-tone-info"><div class="ios-notice-main"><span class="ios-notice-icon">${icon('info')}</span><div><p class="ios-sm">Rain after 6 PM. Pack the awning.</p></div></div></div><div class="ios-notice ios-tone-error"><div class="ios-notice-main"><span class="ios-notice-icon">${icon('error')}</span><div><p class="ios-h3">Can't reach the trailer</p><p class="ios-sm">Check that your phone is on the trailer's Wi-Fi.</p></div></div><div class="ios-row-actions"><button type="button" class="flint-btn flint-btn--primary">Try again</button><button type="button" class="flint-btn flint-btn--secondary">Settings</button></div></div>` }),
    when: ['Something the person should know about this screen right now.'],
    not: ['Confirmation of an action they just took. That is a brief status message.'],
    code: `FlintNotice("Rain after 6 PM. Pack the awning.", tone: .info)

FlintNotice("Check that your phone is on the trailer's Wi-Fi.",
            title: "Can't reach the trailer", tone: .error) {
  Button("Try again") { retry() }.buttonStyle(.flint(.primary))
}`,
    a11y: ['Every tone pairs its color with an icon and words.', 'The title is a heading.', 'Action buttons stack at accessibility text sizes.'],
  },
  tag: {
    name: 'Tag', swift: 'FlintTag', lead: 'A small status pill: a word or two, with an icon if it helps.',
    web: 'badge',
    preview: screen({ body: `<div class="ios-tags"><span class="ios-tag ios-tone-success">${icon('check')}Live</span><span class="ios-tag ios-tone-info">Connecting</span><span class="ios-tag ios-tone-warning">Data is old</span><span class="ios-tag ios-tone-error">Not connected</span><span class="ios-tag ios-tone-neutral">Preview</span></div>` }),
    when: ['Short status next to the thing it describes.'],
    not: ['Anything tappable. Use a secondary button.'],
    code: `FlintTag("Live", tone: .success, systemImage: "checkmark.circle.fill",
         spokenLabel: "Connection: Live")
FlintTag("Preview")`,
    a11y: ['`spokenLabel` adds context VoiceOver needs ("Connection: Live") when the pill alone would be unclear.', 'The icon is hidden from VoiceOver; the words carry the meaning.'],
  },
  card: {
    name: 'Card', swift: '.flintCard()', lead: 'The basic container: rounded corners and a thin edge.',
    preview: screen({ body: '<div class="ios-card"><p class="ios-h3">Big Bend</p><p class="ios-muted">March 14 to 18 · 4 nights</p></div><div class="ios-card"><p class="ios-h3">Guadalupe</p><p class="ios-muted">April 2 to 4 · 2 nights</p></div>' }),
    when: ['Grouping related content on a FlintScreen.'],
    not: ['Settings rows. Use a list.'],
    code: `VStack(alignment: .leading, spacing: Flint.Space.s8) {
  FlintSectionTitle("Big Bend")
  Text("March 14 to 18").flintText(Flint.Typography.bodySm)
}
.flintCard()`,
    a11y: ['The edge is decorative; the content inside carries the meaning.', 'Add `.accessibilityElement(children: .combine)` when the whole card should read as one item.'],
  },
  'toggle-row': {
    name: 'Toggle row', swift: 'FlintToggleRow', lead: 'A big on/off row in a card. It can show a detail line, and when it is turned off for a reason, VoiceOver says why.',
    web: 'switch',
    preview: screen({ body: '<label class="ios-card ios-toggle-row"><span><span class="ios-h3">Awning lights</span><span class="ios-muted">Warm white strip</span></span><input type="checkbox" role="switch" class="ios-switch" checked></label><label class="ios-card ios-toggle-row"><span><span class="ios-h3 ios-dim">Generator</span><span class="ios-muted">Auto start</span><span class="ios-muted">Off while the trailer is on shore power.</span></span><input type="checkbox" role="switch" class="ios-switch" disabled></label>' }),
    when: ['Settings that take effect at once.'],
    not: ['Choices that need a Save button. Use a checkbox in a form.'],
    code: `FlintToggleRow("Awning lights", detail: "Warm white strip", isOn: $lightsOn)

FlintToggleRow("Generator", detail: "Auto start", isOn: $autoStart,
               disabledReason: "Off while the trailer is on shore power.")
  .disabled(onShore)`,
    a11y: ['Reads "Awning lights, switch button, on".', 'A disabled row shows its reason and VoiceOver reads it, so nobody has to guess.', 'The thumb moves, so state never rests on color alone.'],
  },
  'choice-picker': {
    name: 'Choice picker', swift: 'FlintChoicePicker', lead: 'Pick one of a few options. It shows as segments, and switches to rows with a checkmark at large text sizes.',
    web: 'radio',
    preview: screen({ body: `<fieldset class="ios-seg"><legend>Mode</legend>${['Cool', 'Heat', 'Fan'].map((l, i) => `<label><input type="radio" name="__P__-mode" ${i === 0 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset><ul class="ios-group ios-choice-rows" aria-label="Mode">${['Cool', 'Heat', 'Fan'].map((l, i) => `<li><button type="button" class="ios-row" aria-pressed="${i === 0}"><span class="ios-row-text">${l}</span>${i === 0 ? `<span class="ios-row-value ios-check">${icon('check')}</span>` : ''}</button></li>`).join('')}</ul>` }),
    when: ['Two to four short options where the choice takes effect at once.'],
    not: ['Long labels or more than four options. Use a list of rows or a menu.'],
    code: `FlintChoicePicker("Mode", selection: $mode,
                  options: [(.cool, "Cool"), (.heat, "Heat"), (.fan, "Fan")])`,
    a11y: ['At accessibility text sizes it switches to rows, where labels can wrap. The third preview shows it.', 'The selected option is announced as selected in both layouts.'],
  },
  stepper: {
    name: 'Stepper', swift: 'FlintStepper', lead: 'Big minus and plus buttons around a number. VoiceOver treats it as one control you swipe up or down.',
    preview: screen({ body: `<p class="ios-label">Temperature</p><div class="ios-stepper"><button type="button" class="ios-circle" aria-label="Lower">${icon('minus')}</button><span class="ios-stepper-num">72°</span><button type="button" class="ios-circle" aria-label="Raise">${icon('plus')}</button></div>` }),
    when: ['Setting a number by small steps: temperature, count, minutes.'],
    not: ['Values that jump far. Use a field or a slider.'],
    code: `FlintStepper("Temperature", value: $setpoint, in: 60...85,
             display: { "\\($0)°" }, spoken: { "\\($0) degrees" })`,
    a11y: ['VoiceOver hears one element, "Temperature, 72 degrees, adjustable". Swipe up or down to change it.', 'The visual value ("72°") and the spoken value ("72 degrees") are separate.', 'The buttons are 56pt and scale with text size; at accessibility sizes they move under the number.'],
  },
  'stat-tile': {
    name: 'Stat tile', swift: 'FlintStatTile', lead: 'One reading you can take in at a glance: an icon, a title, a big value and a detail.',
    preview: screen({ body: `<div class="ios-card"><div class="ios-stat-head"><span class="ios-stat-icon">${icon('battery')}</span><span class="ios-label">Battery</span></div><span class="ios-stat-value">82%</span><span class="ios-muted">About 9 hours left</span></div><div class="ios-card"><div class="ios-stat-head"><span class="ios-stat-icon">${icon('bolt')}</span><span class="ios-label">Solar</span><span class="ios-row-chev ios-end">${icon('chevron')}</span></div><span class="ios-stat-value">1.24 kW</span></div>` }),
    when: ['Dashboards: a few key readings the person checks often.'],
    not: ['Long text or lists. Use a card or rows.'],
    code: `FlintStatTile("Battery", systemImage: "battery.75", value: "82%",
              detail: "About 9 hours left",
              spokenValue: "82 percent, about 9 hours left")`,
    a11y: ['Read as one element: "Battery, 82 percent, about 9 hours left".', 'Separate spoken values turn units into words ("1.24 kW" becomes "1,240 watts").'],
  },
  'empty-state': {
    name: 'Empty state', swift: 'FlintEmptyState', lead: "For a screen with nothing to show yet: say what happened, what to do, and give one way forward.",
    preview: screen({ body: `<div class="ios-card"><p class="ios-h3 ios-title-icon">${icon('map')}No trips yet</p><p class="ios-sm">Plan your first trip to see it here.</p><ol class="ios-steps"><li>Pick a destination.</li><li>Add dates and campsites.</li></ol><button type="button" class="flint-btn flint-btn--secondary">Plan a trip</button></div>` }),
    when: ['A screen or section with no content yet, or a device not set up.'],
    not: ['Errors that need fixing now. Use a notice with the error tone.'],
    code: `FlintEmptyState("No trips yet", systemImage: "map",
                message: "Plan your first trip to see it here.",
                steps: ["Pick a destination.", "Add dates and campsites."]) {
  Button("Plan a trip") { plan() }.buttonStyle(.flint(.secondary))
}`,
    a11y: ['The title is a heading.', 'Steps read as "Step 1. Pick a destination."'],
  },
};

// Where an iOS component's docs live: one with a web twin sits on that page behind the Web / iOS switch (ASDS-95).
export const iosHref = (slug) => (IOS[slug].web ? `/components/${IOS[slug].web}/?platform=ios` : `/components/ios/${slug}/`);

export const IOS_ORDER = ['tab-bar', 'navigation-bar', 'toolbar', 'list', 'sheet', 'glass-button', 'button', 'notice', 'tag', 'card', 'toggle-row', 'choice-picker', 'stepper', 'stat-tile', 'empty-state'];
