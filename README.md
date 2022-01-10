# tFile

使用 `https://telegra.ph` 的文件上传接口,上传自己的图片或者视频! [~~你可以理解为白嫖~~]

https://wishmelz.github.io/tFile/



因为`telegra`有5M大小的限制, 所以我们可以用TG客户端的链接, TG客户端最大限制为2G!!!!  教程比较复杂[https://github.com/WishMelz/tFile/tree/tgFile]

### 启动运行

```
yarn install
```

```
yarn serve
```

```
yarn build
```

![](https://telegra.ph/file/fa304e656fdf593b1a90c.png)

因为`telegra.ph`的原因, 以及它上传`api`跨域的问题. 所以使用`nginx`代理如下⬇️

```nginx
server {
  	listen 80;
  	server_name xx.xxxx.com; # 这个是域名
	  location /upload {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
    add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
		if ($request_method = 'OPTIONS') {
		    return 204;
		}
	     proxy_pass https://telegra.ph/upload;
	     proxy_redirect default;
    }
}
```

这个是只代理了上传的接口, 当然了你还可以直接代理整个网站,在国内也能用.

```nginx
location / {
    proxy_pass https://telegra.ph/;
    proxy_redirect default;
}
```

修改一下图片的路径 `views/Home.vue`

![](https://telegra.ph/file/13c91b5939c02922df118.png)

如果想批量上传:

```Vue
        <el-upload
          style="width: 100%"
          class="upload-demo"
          drag
          multiple
          action="/"
          :before-upload="befUpload"
        >
```

然后渲染在改成列表渲染!!

