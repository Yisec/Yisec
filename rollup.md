# rollup
主要用于前端库打包

## 本项目中的使用
目前与typescript配合使用，ts文件经过tsc转译成es6/7，然后使用rollup打包成umd
rollup的好处在于，你可以完全使用import的文件引用管理，最终想打包成何种形式的文件，只需要配置好相应的模式
