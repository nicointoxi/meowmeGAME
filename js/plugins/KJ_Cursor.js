 /*:
 * @plugindesc Cursor V1.02 修复冲突
 * @author Kong Jing
 *
 * @param Method
 * @desc choose which method, 0 for normal, 1 for click
 * @default 0
 *
 * @param Name
 * @desc Method 0
 * @default 
 *
 * @param PicSizeX
 * @desc Method 1
 * @default 50
 *
 * @param PicSizeY
 * @desc Method 1
 * @default 80
 *
 * @param Click
 * @desc Method 1, Need Click Animation Or Not
 * @default true
 *

 * @help
 * 第一种，Method为0
 * 光标图片放置于img/system/目录下，名字为Name参数如xxx.xxx。
 * 其他参数都不需要设置.
 * 第二种，Method为1
 * 光标图片放置于img/system/目录下，名字为Cursor.png。
 * 参数X,Y是1帧光标的像素大小，Click是否需要不一样的点击帧光标。
 * 如果需要2帧，2帧光标需并排放。
 * 左边为普通状态，右边为按住键盘的状态。
 */
var KJ = KJ || {};
KJ.Cursor = KJ.Cursor || {};
KJ.Cursor.Parameters = PluginManager.parameters('KJ_Cursor');
KJ.Cursor.Method = parseInt(KJ.Cursor.Parameters['Method']);
KJ.Cursor.Name = String(KJ.Cursor.Parameters['Name']);
KJ.Cursor.PicSizeX = parseInt(KJ.Cursor.Parameters['PicSizeX']);
KJ.Cursor.PicSizeY = parseInt(KJ.Cursor.Parameters['PicSizeY']);
KJ.Cursor.Click = KJ.Cursor.Parameters['Click'].toLowerCase() === 'true';
if(!KJ.Cursor.Method){
	document.body.style.cursor = "url(img/system/"+KJ.Cursor.Name+"),auto";
}
if(KJ.Cursor.Method){
	document.onmousemove = function(e){
	   e = e || window.event;
	   if(e.pageX || e.pageY)
	   {
			KJ.Cursor.x = Graphics.pageToCanvasX(e.pageX);
			KJ.Cursor.y = Graphics.pageToCanvasY(e.pageY); 
	   } 
	};
	document.body.style.cursor = "none";
	KJ.Cursor.Scene_Base_initialize = Scene_Base.prototype.initialize;
	Scene_Base.prototype.initialize = function() {
		KJ.Cursor.Scene_Base_initialize.call(this);
		this._cursorBitmap = ImageManager.loadSystem("Cursor");
		this._cursorIndex = 0;
	};
	KJ.Cursor.Scene_Base_start = Scene_Base.prototype.start;
	Scene_Base.prototype.start = function() {
		KJ.Cursor.Scene_Base_start.call(this);
		if(!this._CursorSprite){
			this._CursorSprite = new Sprite(null);
			this._CursorSprite.bitmap = new Bitmap(KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY);
			this._CursorSprite.anchor.x = 0.5;
			this._CursorSprite.anchor.y = 0.5;
			this._CursorSprite.bitmap.blt(this._cursorBitmap, 0, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY, 0, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY);
			this.addChild(this._CursorSprite);
		}
	};
	KJ.Cursor.Scene_Base_update = Scene_Base.prototype.update;
	Scene_Base.prototype.update = function() {
		KJ.Cursor.Scene_Base_update.call(this);
		if(KJ.Cursor.Click){
			if(TouchInput.isPressed()){
				if(this._cursorIndex != 1){
					this._CursorSprite.bitmap.clear();
					this._CursorSprite.bitmap.blt(this._cursorBitmap, KJ.Cursor.PicSizeX, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY, 0, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY);
					this._cursorIndex = 1;
				}
			}
			else{
				if(this._cursorIndex != 0){
					this._CursorSprite.bitmap.clear();
					this._CursorSprite.bitmap.blt(this._cursorBitmap, 0, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY, 0, 0, KJ.Cursor.PicSizeX, KJ.Cursor.PicSizeY);
					this._cursorIndex = 0;
				}
			}
		}
		if(TouchInput.isTriggered()){
			if(this._CursorSprite && TouchInput.x){
				this._CursorSprite.x = TouchInput.x;
				this._CursorSprite.y = TouchInput.y;
			}
		}
		else if(KJ.Cursor.x && this._CursorSprite){
			this._CursorSprite.x = KJ.Cursor.x;
			this._CursorSprite.y = KJ.Cursor.y;
		}
	};
}
