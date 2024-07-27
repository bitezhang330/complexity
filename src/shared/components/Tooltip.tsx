import { Tooltip as ArkTooltip, Portal } from "@ark-ui/react";
import { ElementRef, FC, forwardRef, ReactNode } from "react";

import { cn } from "@/utils/cn";

const TooltipRoot: FC<ArkTooltip.RootProps> = ({ ...props }) => {
  return <ArkTooltip.Root unmountOnExit={false} {...props} />;
};

Tooltip.displayName = "Tooltip";

const TooltipTrigger = forwardRef<
  ElementRef<typeof ArkTooltip.Trigger>,
  ArkTooltip.TriggerProps
>(({ ...props }, ref) => {
  return <ArkTooltip.Trigger ref={ref} {...props} />;
});

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = forwardRef<
  ElementRef<typeof ArkTooltip.Content>,
  ArkTooltip.ContentProps
>(({ className, ...props }, ref) => {
  return (
    <Portal>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          ref={ref}
          className={cn(
            "tw-z-50 tw-max-w-[400px] tw-overflow-hidden tw-whitespace-pre-line tw-rounded-md tw-bg-foreground tw-px-2 tw-py-1 tw-font-sans tw-text-xs tw-text-popover tw-shadow-md tw-duration-150 dark:tw-bg-accent dark:tw-text-popover-foreground",
            "data-[state=open]:tw-animate-in data-[state=closed]:tw-animate-out",
            "data-[state=closed]:tw-fade-out-0 data-[state=open]:tw-fade-in-0",
            "data-[state=closed]:tw-zoom-out-95 data-[state=open]:tw-zoom-in-95",
            "data-[side=bottom]:tw-slide-in-from-top-2 data-[side=left]:tw-slide-in-from-right-2",
            "data-[side=right]:tw-slide-in-from-left-2 data-[side=top]:tw-slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ArkTooltip.Positioner>
    </Portal>
  );
});

TooltipContent.displayName = "TooltipContent";

export { TooltipRoot, TooltipTrigger, TooltipContent };

export type TooltipProps = {
  children: ReactNode;
  disabled?: boolean;
  content: ReactNode;
  className?: string;
  positioning?: ArkTooltip.RootProps["positioning"];
};

export default function Tooltip({
  children,
  disabled,
  content,
  className,
  positioning,
}: TooltipProps) {
  if (disabled) {
    return children;
  }

  return (
    <TooltipRoot
      openDelay={0}
      closeDelay={0}
      positioning={{
        placement: "top",
        ...positioning,
      }}
    >
      <TooltipTrigger asChild>
        <div>{children}</div>
      </TooltipTrigger>
      {content && (
        <TooltipContent className={cn(className)}>{content}</TooltipContent>
      )}
    </TooltipRoot>
  );
}
