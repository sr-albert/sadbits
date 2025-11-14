import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { JSX } from "react/jsx-runtime";
import TaskManagement from "../TaskManagement/TaskManagement";

export default function Work(): JSX.Element {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-(--spacing(16)))]"
    >
      <ResizablePanel defaultSize={100}>
        <TaskManagement />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={100}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={100}>
            Calendar view / Widget View
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={100}>
            Calendar view / Widget View
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
