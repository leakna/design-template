import { fabric } from "fabric";
import { useCallback, useEffect } from "react";

interface UseAutoResizeProps {
    canvas: fabric.Canvas | null;
    container: HTMLDivElement | null;
}

export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {

    const autoResize = useCallback(() => {
        if (!canvas || !container) return;

        canvas.setWidth(container.offsetWidth)
        canvas.setHeight(container.offsetHeight)

        const center = canvas.getCenter()
        const zoomRatio = 0.85;
        const localWorkSpace = canvas.getObjects().find((obj) => obj.name === "clip")
        //@ts-ignore
        const scale = fabric.util.findScaleToFit(localWorkSpace, { width: container.offsetWidth, height: container.offsetHeight });

        const zoom = zoomRatio * scale;

        canvas.setViewportTransform(fabric.iMatrix.concat())

        canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom)

        if (!localWorkSpace) return;

        const workspaceCenter = localWorkSpace.getCenterPoint()
        const viewportTransform = canvas.viewportTransform;

        if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) { return };

        viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
        viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

        canvas.setViewportTransform(viewportTransform)

        localWorkSpace.clone((cloned: fabric.Rect) => {//replace the current workspace on the canvas with the newly cloned one.
            canvas.clipPath = cloned;
            canvas.requestRenderAll();

        })

    }, [canvas, container])

    useEffect(() => {
        //resizeObserver allows you to detect when an element's dimensions (width, height) change and respond to those changes
        let resizeObserver: ResizeObserver | null = null
        if (canvas && container) {
            resizeObserver = new ResizeObserver(() => {
                console.log("Resize")
                autoResize()//to start motoring its size
            })

            resizeObserver.observe(container)
            return () => {
                if (resizeObserver) {
                    resizeObserver.disconnect() //stop the ResizeObserver from observing all of the target elements that were being monitored
                }
            }
        }

    }, [container, canvas, autoResize])
    return { autoResize };
}