"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MaxPool2DBackpropProgram = (function () {
    function MaxPool2DBackpropProgram(convInfo) {
        this.variableNames = ['dy', 'maxPos'];
        this.outputShape = convInfo.inShape;
        var dyRows = convInfo.outShape[0];
        var dyCols = convInfo.outShape[1];
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        this.params =
            [filterHeight, filterWidth, strideHeight, strideWidth, padTop, padLeft];
        var lastIndex = filterHeight * filterWidth - 1;
        this.userCode = "\n      const ivec2 pads = ivec2(" + padTop + ", " + padLeft + ");\n\n      void main() {\n        ivec3 coords = getOutputCoords();\n        int d = coords.z;\n\n        ivec2 dyRCCorner = coords.xy - pads;\n        int dyRCorner = dyRCCorner.x;\n        int dyCCorner = dyRCCorner.y;\n\n        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).\n        // ? = to be determined. : = across all values in that axis.\n        float dotProd = 0.0;\n        for (int wR = 0; wR < " + filterHeight + "; wR++) {\n          float dyR = float(dyRCorner + wR) / " + strideHeight + ".0;\n\n          if (dyR < 0.0 || dyR >= " + dyRows + ".0 || fract(dyR) > 0.0) {\n            continue;\n          }\n          int idyR = int(dyR);\n\n          for (int wC = 0; wC < " + filterWidth + "; wC++) {\n            float dyC = float(dyCCorner + wC) / " + strideWidth + ".0;\n\n            if (dyC < 0.0 || dyC >= " + dyCols + ".0 || fract(dyC) > 0.0) {\n              continue;\n            }\n            int idyC = int(dyC);\n\n            float dyValue = getDy(idyR, idyC, d);\n            int maxPosValue = " + lastIndex + " - int(getMaxPos(idyR, idyC, d));\n\n            // Get the current value, check it against the value from the\n            // position matrix.\n            int curPosValue = wR * " + filterWidth + " + wC;\n            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);\n\n            dotProd += dyValue * mask;\n          }\n        }\n        setOutput(dotProd);\n      }\n    ";
    }
    return MaxPool2DBackpropProgram;
}());
exports.MaxPool2DBackpropProgram = MaxPool2DBackpropProgram;
//# sourceMappingURL=max_pool_backprop_gpu.js.map