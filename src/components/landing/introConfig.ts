/** Replace the file at this path to change the opening footage. No remote media. */
export const introConfig = {
  videoSrc: "/media/astra-intro.mp4",
  // Optional local poster. The CSS orbital background is always available beneath it.
  posterSrc: undefined as string | undefined,
  // Leave off for the supplied video, which already contains a title layer.
  showAdditionalText: false,
  additionalText: "Start Online, Honey System",
  loadingTimeout: 2000,
  seamDuration: 100,
  doorDuration: 600,
  enterDuration: 600,
};
