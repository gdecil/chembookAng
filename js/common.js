var  getObjects = function (obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        }

function getKetcher()
		{
			var frame = null;
			
			if ('frames' in window && 'ketcherFrame' in window.frames)
				frame = window.frames['ketcherFrame'];
			else
				return null;
				
			if ('window' in frame)
				return frame.window.ketcher;
		}