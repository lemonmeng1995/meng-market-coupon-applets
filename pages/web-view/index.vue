<!-- 打开H5页面 -->
<template>
	<view><web-view :src="src"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			SystemInfo: this.SystemInfo,
			src: null
		};
	},
	onLoad(e) {
		let page = this;
		if (e.src) {
			let src = decodeURIComponent(e.src)
			page.src = src;
			// plus.runtime.openURL(src)
		}
	},
	computed: {},
	methods: {}
};
</script>

<style></style>
