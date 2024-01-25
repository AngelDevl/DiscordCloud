import path from 'path'
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const BUILD_DIR  = path.resolve(__dirname, './public/build')
const APP_DIR  = path.resolve(__dirname, './client')

const webpack_config = {
    entry: APP_DIR + '/index.js',

    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.js$|jsx/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-react', '@babel/preset-env']                
                  },
                },
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            } 
        ]
    },
}


export default webpack_config