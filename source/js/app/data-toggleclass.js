/*
	<a href="javascript:;" data-toggleclass-target=".j-something">Toggles .isActive on .j-something</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass="aClass">Toggles .aClass on .j-something</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass-add="aClass">Adds .aClass on .j-something</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass-remove="aClass">Removes .aClass from .j-something</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass-remove="aClass" data-toggleclass-add="bClass">Removes .aClass from .j-something and adds .bClass to it</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass-exclusive="aClass">Toggles .aClass on .j-something and removes .aClass from .j-something's siblings</a>
	<a href="javascript:;" data-toggleclass-target=".j-something" data-toggleclass-exclusive-add="aClass">Adds .aClass on .j-something and removes .aClass from .j-something's siblings</a>
*/

(function() {

	var clickToggle = function(e){
		e.preventDefault();
		console.log("ioio");

		var $this=$(this);
		if(!$this.hasClass("js-toggleclass-disabled")){
			var
				$target=$($this.data("toggleclass-target")),
				exclusive=$this.data("toggleclass-exclusive"),
				exclusive_add=$this.data("toggleclass-exclusive-add");
			//var
			if(exclusive) {
				$target.toggleClass(exclusive).siblings().removeClass(exclusive);
			}
			else if(exclusive_add) {
				$target.addClass(exclusive_add).siblings().removeClass(exclusive_add);
			}
			else {
				var
					add=$this.data("toggleclass-add"),
					remove=$this.data("toggleclass-remove");
				//var
				$target.toggleClass($this.data("toggleclass")||(add||remove?"":"isActive")).addClass(add).removeClass(remove);
			}
		}
	};

	$(document).on("click", "[data-toggleclass-target]", clickToggle);
})();


