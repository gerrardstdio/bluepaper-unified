const InvitationShell = ({ children, isLocked = false, scrollRef }) => {
  return (
    <main
      ref={scrollRef}
      data-scroll-root
      className={`
        fixed
        right-0
        top-0
        z-40
        h-screen
        w-full
        bg-white
        xl:w-[35vw]
        ${isLocked ? "overflow-hidden" : "overflow-y-auto"}
        snap-y
        snap-mandatory
      `}
    >
      {children}
    </main>
  );
};

export default InvitationShell;
