import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, Eraser, Tag, PlusCircle, ChevronLeft, ChevronRight, Edit2, MoreVertical, ChevronDown 
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Custom hook for detecting platform
const usePlatform = () => {
  const [platform, setPlatform] = useState({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setPlatform({
      isIOS: /iphone|ipad|ipod/.test(ua),
      isAndroid: /android/.test(ua),
      isMobile: /mobile/.test(ua),
      isTablet: /tablet|ipad/.test(ua) || (window.innerWidth >= 768 && window.innerWidth <= 1024)
    });
  }, []);

  return platform;
};

const MobileHeader = ({ onMenuOpen, title }) => (
  <div className="flex items-center justify-between p-4 border-b bg-white">
    <Button variant="ghost" size="icon" onClick={onMenuOpen}>
      <Menu className="h-6 w-6" />
    </Button>
    <h1 className="text-lg font-medium truncate">{title}</h1>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Camera className="w-4 h-4 mr-2" /> Screenshot
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="w-4 h-4 mr-2" /> Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash2 className="w-4 h-4 mr-2" /> Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const MobileDrawingControls = ({ color, setColor, lineWidth, setLineWidth }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button
        className="fixed bottom-20 right-4 rounded-full shadow-lg"
        size="icon"
      >
        <Edit2 className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-72">
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="mb-2">Color</div>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16"
            />
          </div>
          <div className="text-center">
            <div className="mb-2">Width</div>
            <div className="flex flex-col items-center">
              <Input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-32"
              />
              <span className="mt-2">{lineWidth}px</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'].map(colorOption => (
            <button
              key={colorOption}
              className="w-12 h-12 rounded-full border"
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

const MobileNavigation = ({ pages, currentPageIndex, onPageChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
    <div className="flex items-center justify-between max-w-md mx-auto">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPageIndex - 1)}
        disabled={currentPageIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Page {currentPageIndex + 1} of {pages.length}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {pages.map((page, index) => (
            <DropdownMenuItem
              key={page.id}
              onClick={() => onPageChange(index)}
            >
              {page.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPageIndex + 1)}
        disabled={currentPageIndex === pages.length - 1}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  </div>
);

const MobileDrawingSurface = ({ canvasRef, platform, ...props }) => {
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent scrolling on touch
    if (platform.isIOS) {
      // iOS-specific touch handling
      const touch = e.touches[0];
      props.onDrawStart(touch.clientX, touch.clientY);
    } else {
      // Android and other devices
      const touch = e.touches[0];
      props.onDrawStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling on touch
    if (props.isDrawing) {
      const touch = e.touches[0];
      props.onDraw(touch.clientX, touch.clientY);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="touch-none w-full h-full bg-white"
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={props.onDrawEnd}
        onTouchCancel={props.onDrawEnd}
        {...props}
      />
    </div>
  );
};

const Whiteboard = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const platform = usePlatform();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false); // Added state for drawing
  const [pages, setPages] = useState([{id:1, name: 'Page 1'}]); //Example pages
  const [currentPageIndex, setCurrentPageIndex] = useState(0); //Example currentPageIndex
  const [folders, setFolders] = useState([]); //Example folders
  const [currentFolder, setCurrentFolder] = useState(null); //Example currentFolder

  const saveCurrentPage = () => {
    //Implementation for saving current page
    console.log("Saving current page");
  }

  const clearCanvas = () => {
    //Implementation to clear canvas
    console.log("Clearing canvas");
  }

  const takeScreenshot = () => {
    //Implementation to take screenshot
    console.log("Taking screenshot");
  }


  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        const devicePixelRatio = window.devicePixelRatio || 1;

        // Set canvas size in pixels
        canvas.width = parent.offsetWidth * devicePixelRatio;
        canvas.height = parent.offsetHeight * devicePixelRatio;

        // Scale canvas for high DPI displays
        const ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);

        // Set display size
        canvas.style.width = `${parent.offsetWidth}px`;
        canvas.style.height = `${parent.offsetHeight}px`;

        // Restore drawing settings
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [color, lineWidth]);

  // Touch drawing handlers
  const handleDrawStart = (x, y) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(x - rect.left, y - rect.top);
    setIsDrawing(true);
  };

  const handleDraw = (x, y) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    ctx.lineTo(x - rect.left, y - rect.top);
    ctx.stroke();
  };

  const handleDrawEnd = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {isMobile ? (
        <>
          <MobileHeader
            onMenuOpen={() => setShowMobileMenu(true)}
            title={pages[currentPageIndex].name}
          />

          <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
            <SheetContent side="left" className="w-4/5">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FolderTree
                  folders={folders}
                  currentFolder={currentFolder}
                  onFolderSelect={(folder) => {
                    setCurrentFolder(folder);
                    setShowMobileMenu(false);
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <main className="flex-1 relative">
            <MobileDrawingSurface
              canvasRef={canvasRef}
              platform={platform}
              isDrawing={isDrawing}
              onDrawStart={handleDrawStart}
              onDraw={handleDraw}
              onDrawEnd={handleDrawEnd}
            />
            <MobileDrawingControls
              color={color}
              setColor={setColor}
              lineWidth={lineWidth}
              setLineWidth={setLineWidth}
            />
          </main>

          <MobileNavigation
            pages={pages}
            currentPageIndex={currentPageIndex}
            onPageChange={(index) => {
              saveCurrentPage();
              setCurrentPageIndex(index);
            }}
          />

          <div className="fixed bottom-20 left-4">
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-white"
                onClick={clearCanvas}
              >
                <Eraser className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-white"
                onClick={takeScreenshot}
              >
                <Camera className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Placeholder for desktop layout - needs to be replaced with actual desktop code
        <div>Desktop Layout</div>
      )}
    </div>
  );
};

export default Whiteboard;