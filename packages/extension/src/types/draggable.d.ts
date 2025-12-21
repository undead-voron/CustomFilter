declare module 'draggable' {
  export interface DraggableOptions {
    /**
     * Grid size for snapping on drag
     * @default 0
     */
    grid?: number;
    
    /**
     * The handle of the draggable; if null, the whole element is the handle
     * @default null
     */
    handle?: Element | null;
    
    /**
     * Prevent drag when target passes this test
     * @default null
     */
    filterTarget?: (target: Element) => boolean;
    
    /**
     * Limit x/y drag bounds
     * @default { x: null, y: null }
     */
    limit?: Element | 
      { x?: number[] | number | null, y?: number[] | number | null } | 
      ((x: number, y: number, x0: number, y0: number) => { x: number, y: number });
    
    /**
     * Threshold before drag begins (in px)
     * @default 0
     */
    threshold?: number;
    
    /**
     * Change cursor to move?
     * @default false
     */
    setCursor?: boolean;
    
    /**
     * Change draggable position to absolute?
     * @default true
     */
    setPosition?: boolean;
    
    /**
     * Snap to grid only when dropped, not during drag
     * @default true
     */
    smoothDrag?: boolean;
    
    /**
     * Move graphics calculation/composition to the GPU?
     * @default true
     */
    useGPU?: boolean;
    
    /**
     * Event fired during drag
     */
    onDrag?: (element: Element, x: number, y: number, event: MouseEvent | TouchEvent) => void;
    
    /**
     * Event fired when drag starts
     */
    onDragStart?: (element: Element, x: number, y: number, event: MouseEvent | TouchEvent) => void;
    
    /**
     * Event fired when drag ends
     */
    onDragEnd?: (element: Element, x: number, y: number, event: MouseEvent | TouchEvent) => void;
  }

  export interface DraggableCoordinates {
    x: number;
    y: number;
  }

  export interface DraggableInstance {
    /**
     * Get the current coordinates
     */
    get(): DraggableCoordinates;
    
    /**
     * Move to the specified coordinates
     */
    set(x: number, y: number): DraggableInstance;
    
    /**
     * Set an option in the live instance
     */
    setOption(property: string, value: any): DraggableInstance;
    
    /**
     * Unbind the instance's DOM event listeners
     */
    destroy(): void;
  }

  /**
   * High performance, fully cross browser, full featured drag and drop in a tiny package.
   */
  export default class Draggable implements DraggableInstance {
    constructor(element: Element, options?: DraggableOptions);
    
    /**
     * Get the current coordinates
     */
    get(): DraggableCoordinates;
    
    /**
     * Move to the specified coordinates
     */
    set(x: number, y: number): DraggableInstance;
    
    /**
     * Set an option in the live instance
     */
    setOption(property: string, value: any): DraggableInstance;
    
    /**
     * Unbind the instance's DOM event listeners
     */
    destroy(): void;
  }
} 