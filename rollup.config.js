import typescriptPlugin from "rollup-plugin-typescript";
import typescript from "typescript";

export default {
	input: "src/Visualization.ts",
	external: [ "three", "most" ],
	output: {
		name: "Visualization",
		file: "build/Visualization.js",
		format: "umd",
		globals: {
			three: "THREE",
			most: "most"
		}
	},
	plugins: [
		typescriptPlugin( {
			target: "es5",
			typescript: typescript
		} )
	]
}