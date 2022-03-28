//xvxshenhun@qq.com，使用请标来源，（禁止删除本注释）<我没有把js加密算不错了(狗头)>
const {
    //白, 绿, 黄, 橙, 红, 蓝, 紫,
    jingliantai, zuanshikuang, zuanjing, hua1, hua2, hua3, tanban, zhiwumo,
    kuangzajinghuawu, weijing1, weijing2, xiao, liziye, juhebaozhawu, weijing3
    , weijing4, weijing5, guijingti, molishi, monengjing, monengjing1,
    monengjing2, monengjing3, buding, chuangshilizi, chuangshishenhun
    , chuangshiweichen, chuangshizhixing, jin, jinfen, molizhi,
    shimoxi, shiying, yuanshencanpian, zhayao, zijing1, zzjinbi,
    invalid, dabaosuan, molijinghuaye, moliye, qiangxiaolengqueye,
    zhiwujinghuaye, suan, yuanwan0, dabaoshui, dabaoleng, dabaoshiyou,dabaozhiwujingyou,
    dabaoJHLiquid,dabaojinglianlio,dabaomoli, dabaozhiwu, dabaojingmoli, 
    dabaoyedan,zhiwujingyou,jinglianlio,hejinboli,
    JHhejinLiquid,JHhejin,gutaiwanqin,taihejin,
} = require('wupin');

//塑钢路由器
const dsGlobal =require('BlocksLibes/qianzhi');
const crouter = extend(StackConveyor, "luyouqi", {
	isHidden() { return !dsGlobal.H1(); },
	load() {
		this.super$load();

		this.baseRegion = Core.atlas.find(this.name + "-base");
		// For drawRequest
		this.regions[0] = this.baseRegion;
	},
	blends(tile, rot, otherx, othery, otherrot, other) {
		/* Function overloading is very messy with rhino */
		if (other == undefined && othery != undefined) {
			const directional = otherx;
			const direction = othery;
			const checkWorld = otherrot;

			const realDir = direction % 4;
			if (directional && directional[realDir]) {
				const req = directional[realDir];
				if (this.blends(tile, rot, req.x, req.y, req.rotation, req.block)) {
					return true;
				}
			}
			if (!checkWorld) return false;

			otherx = direction;
			othery = undefined;
		}

		if (othery == undefined) {
			const direction = otherx;
			other = tile.nearbyBuild(direction % 4);
			if (!other || other.team != tile.team()) return false;

			otherx = other.tileX();
			othery = other.tileY();
			otherrot = other.rotation;
			other = other.block;
		}

		// Blend with roomba and roomba router only
		return other instanceof StackConveyor;
	}
});
crouter.category = Category.logic;
crouter.buildType = () => extend(StackConveyor.StackConveyorBuild, crouter, {
	draw() {
		Draw.rect(crouter.baseRegion, this.x, this.y);

		for (var i = 0; i < 4; i++) {
			if ((this.blendprox & (1 << i)) == 0) {
				Draw.rect(crouter.edgeRegion, this.x, this.y, i * 90);
			}
		}
	},

	updateTile() {
		if (this.cooldown > 0) this.cooldown = Mathf.clamp(this.cooldown - crouter.speed * this.edelta(),
			0, crouter.recharge);
		if (this.cooldown > 0 || this.items.total() < crouter.itemCapacity) return;
		if (!this.lastItem) {
			this.lastItem = this.items.first();
		}

		const other = this.getTileTarget(true);
		if (!other || other.link != -1) return;

		other.items.add(this.items);
		this.items.clear();
		other.lastItem = this.lastItem;

		other.link = this.tile.pos();
		this.link = -1;

		this.cooldown = crouter.recharge;
		other.cooldown = 1;
	},

	onProximityUpdate() {
		this.super$onProximityUpdate();

		// We don't care about state, only remake blendprox

		this.blendprox = 0;
		for (var i = 0; i < 4; i++) {
			if (crouter.blends(this.tile, 0, i)) {
				this.blendprox |= (1 << i);
			}
		}
	},

	acceptItem(source, item) {
		if (source == this) return true;
		if (this.cooldown > crouter.recharge - 1) return false;
		return (this.items.total() > 0 && !this.items.has(item))
			|| (this.items.total() >= this.getMaximumAccepted(item));
			// ignore source direction and state
	},

	// routing is mechanical idk
	shouldIdleSound: () => true,

	getTileTarget(set) {
		// TODO: controllable roomba router?

		const prox = this.proximity;
		var counter = this.rotation;
		for (var i = 0; i < prox.size; i++) {
			var other = prox.get((counter + i) % prox.size);
			if (set) this.rotation = (this.rotation + 1) % prox.size;
			if (other.block instanceof StackConveyor && this.outputsItem(other)) {
				return other;
			}
		}
		return null;
	},

	outputsItem(other) {
		return (other.block == crouter || other.front() != this)
			&& (other.items.total() == 0);
	}
});
crouter.health= 80
crouter.speed= 0.133333333
crouter.itemCapacity= 10
crouter.insulated= true
crouter.group = BlockGroup.transportation;
crouter.rotate= false
crouter.requirements = ItemStack.with(
Items.lead, 30,
Items.plastanium, 15
);
crouter.buildVisibility = BuildVisibility.shown;
crouter.category = Category.distribution;
exports.crouter = crouter;