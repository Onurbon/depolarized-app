import { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'

export const ThreeColumnLayout = ({ left, leftLabel, children, right, rightLabel }: any) => {
  const middle = children
  const initLeft = localStorage.leftPanelWidth ? parseInt(localStorage.leftPanelWidth) : 300
  const [leftPanelWidth, setLeftPanelWidth] = useState(initLeft);
  const initRight = localStorage.rightPanelWidth ? parseInt(localStorage.rightPanelWidth) : 300
  const [rightPanelWidth, setRightPanelWidth] = useState(initRight);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const toggleLeftPanel = () => setIsLeftPanelOpen((prev) => !prev);
  const toggleRightPanel = () => setIsRightPanelOpen((prev) => !prev);

  const handleLeftPanelDrag = (event: any) => {
    setLeftPanelWidth(event.pageX);
    localStorage.leftPanelWidth = event.pageX
  };
  const handleRightPanelDrag = (event: any) => {
    const width = window.innerWidth - event.pageX;
    setRightPanelWidth(width);
    localStorage.rightPanelWidth = width
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel */}
      <div
        className="h-full flex-none bg-blue-50 border-r border-gray-200 relative hidden md:block"
        style={{ width: `${isLeftPanelOpen ? leftPanelWidth : 30}px` }}
      >
        {/* Left Resizing  */}
        {isLeftPanelOpen && <div
          className="absolute top-0 right-0 bottom-0 w-1 z-10 bg-blue-200"
          onMouseDown={(event) => {
            event.preventDefault();
            window.addEventListener("mousemove", handleLeftPanelDrag);
            window.addEventListener("mouseup", () => {
              window.removeEventListener("mousemove", handleLeftPanelDrag);
            });
          }}
          style={{ cursor: "col-resize" }}
        />}
        {/* Left Toggle Button */}
        {isLeftPanelOpen &&
          <div className="flex justify-end p-2 h-[50px]">
            <button className="bg-blue-200 rounded pl-4" onClick={toggleLeftPanel}>
              {leftLabel}
              <ChevronLeftIcon className="inline w-10" />
            </button>
          </div>}
        {/* Left Content */}
        {isLeftPanelOpen ?
          <div className="p-2 pr-4 overflow-y-auto"
            style={{ height: 'calc(100% - 50px)' }}>
            {left}
          </div>
          :
          <div className="bg-blue-200 rounded"
            onClick={toggleLeftPanel}
            style={{
              width: '250px',
              rotate: '270deg',
              textAlign: 'center',
              transform: 'translateX(-260px)',
              transformOrigin: 'top left'
            }}>{leftLabel}</div>}

        {/* Left resizing */}
      </div>

      {/* Middle Panel */}
      <div className="flex-1 h-full p-4 pt-10 overflow-y-auto">
        <div className="">{middle}</div>
      </div>

      {/* Right Panel */}
      <div
        className={`flex-none h-full bg-red-50 border-l border-gray-200 relative hidden md:block`}
        style={{ width: `${isRightPanelOpen ? rightPanelWidth : 30}px` }}
      >
        {/* Right Resizing  */}
        {isRightPanelOpen && <div
          className="absolute top-0 left-0 bottom-0 w-1 z-10 bg-red-200"
          onMouseDown={(event) => {
            event.preventDefault();
            window.addEventListener("mousemove", handleRightPanelDrag);
            window.addEventListener("mouseup", () => {
              window.removeEventListener("mousemove", handleRightPanelDrag);
            });
          }}
          style={{ cursor: "col-resize" }}
        />}
        {/* Toggle Button */}
        {isRightPanelOpen && <div className="flex justify-start p-2 h-[50px]">
          <button className="bg-red-200 rounded pr-4" onClick={toggleRightPanel}>
            <ChevronRightIcon className="inline w-10" />
            {rightLabel}
          </button>
        </div>}

        {/* Content */}
        <div className="" >{
          isRightPanelOpen ?
            <div className="p-2 pr-4 overflow-y-auto"
              style={{ height: 'calc(100% - 50px)' }}>
              {right}
            </div>
            :
            <div className="bg-red-200 rounded"
              onClick={toggleRightPanel}
              style={{
                width: '250px',
                rotate: '90deg',
                textAlign: 'center',
                transform: 'translateX(-20px)',
                transformOrigin: 'bottom left'
              }}>{rightLabel}</div>
        }</div>
      </div>
    </div >
  );
};

