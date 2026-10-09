// InvitationSection.jsx
import useInvitationReveal from "../../hooks/useInvitationReveal";

const InvitationSection = ({
  children,
  id,
  height = "screen",
  animation = "fade",
  trigger = "scroll",
  delay = 0,
  isOpen = false,
  scrollRoot = null,
  className = "",
}) => {
  const sectionRef = useInvitationReveal({
    isOpen,
    scrollRoot,
    animation,
    trigger,
    delay,
  });

  const heightClass = height === "screen" ? "min-h-screen" : "min-h-0";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`
        ${heightClass}
        snap-start
        ${className}
      `}
    >
      {children}
    </section>
  );
};

export default InvitationSection;
