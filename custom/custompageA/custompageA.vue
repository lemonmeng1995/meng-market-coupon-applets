<template>
	<view class="img-box">
		<image :src='src' mode="widthFix" @click="linkUrl"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: '',
				url: ''
			}
		},
		onLoad(e) {
			uni.showLoading({
				title: '加载中'
			})
			this.src = e.img + this.$Fn.imageResize();
			this.url = decodeURIComponent(e.url);
			uni.hideLoading()
		},
		methods: {
			linkUrl() {
				if (this.url && (this.url.indexOf('http') != -1)) {
					this.$Fn.throttle(() => {
						this.$St.navigate(`/pages/web-view/index?src=${encodeURIComponent(this.url)}`);
					})();
				}else{
					return
				}
			}
		}
	}
</script>

<style lang="scss">
	.img-box {
		width: 100%;

		image {
			width: 100%;
		}
	}
</style>
