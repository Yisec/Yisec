# 创建软连指向node_modules，方便test
ln:
	export P=`pwd`; ln -sf $${P} node_modules/fv

# 删除软连接
unln:
	rm -rf node_modules/fv

	
