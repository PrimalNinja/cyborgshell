// options: alias, connection, databasename, provider, readonly
function imdbProvider(objIDB_a, objOptions_a)
{
	var m_objIDB = objIDB_a;
	var m_arrFullCapabilities = ['read']; // todo: should reflect how this is exposed within our API

	// setup table defs
	var m_objMovieTableDef = m_objIDB.createTableDef('movies',
			[
				{
					fieldname : 'id',
					alias : 'id',
					datatype : 'text',
					size : 20
				},
				{
					fieldname : 'title',
					alias : 'title',
					datatype : 'text',
					size : 20
				},
				{
					fieldname : 'year',
					alias : 'year',
					datatype : 'text',
					size : 20
				}
			]);

	var m_objActorTableDef = m_objIDB.createTableDef('actors',
			[
				{
					fieldname : 'id',
					alias : 'id',
					datatype : 'text',
					size : 20
				},
				{
					fieldname : 'actor',
					alias : 'actor',
					datatype : 'text',
					size : 20
				}
			]);

	function imdbRead(strTitle_a, cb_a)
	{
		var strFirstLetter = strTitle_a.substring(0, 1);

		$.ajax(
		{
			url : 'http://sg.media-imdb.com/suggests/' + strFirstLetter + '/' + strTitle_a + '.json',
			dataType : 'jsonp',
			jsonp : false,
			jsonpCallback : 'imdb$foo'
		}
		).done(function (objResult)
		{
			cb_a(objResult);
		}
		);
	}

	// read
	this.dbclose = function (cbSuccess_a, cbError_a)
	{
		cbSuccess_a();
	};
	this.dbgetcapabilities = function ()
	{
		return m_arrFullCapabilities;
	};
	this.dbopen = function (cbSuccess_a, cbError_a)
	{
		cbSuccess_a();
	};
	this.dbisreadonly = function ()
	{
		return true;
	};

	this.dbreadtabledef = function (strTableName_a, cbSuccess_a, cbError_a)
	{
		if (strTableName_a === 'actors')
		{
			cbSuccess_a(m_objActorTableDef);
		}
		else if (strTableName_a === 'movies')
		{
			cbSuccess_a(m_objMovieTableDef);
		}
	};

	this.dbreadtablelist = function (cbSuccess_a, cbError_a)
	{
		cbSuccess_a(['actors', 'movies']);
	};

	this.dbselect = function (strTableName_a, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		var strTitle = objWhere_a.title;
		if (strTitle === undefined)
		{
			strTitle = '';
		}

		if (strTitle.length === 0)
		{
			cbError_a();
		}
		else
		{
			imdbRead(strTitle, function (objResponse_a)
			{
				var objResult = [];
				var arrRecords = objResponse_a.d;
				processArray(arrRecords, function (objRecord_a)
				{
					objResult.push(
					{
						id : objRecord_a.id,
						title : objRecord_a.l,
						year : objRecord_a.y
					}
					);
				}
				);

				cbSuccess_a(objResult);
			}
			);
		}
	}; // todo (cater for result field list)

	// write
	this.dbdelete = function (strTableName_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbinsert = function (strTableName_a, objFieldset_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbinsertdataset = function (strTableName_a, objDataset_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbtruncatetable = function (strTableName_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbupdate = function (strTableName_a, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};

	// ddl
	this.dbaddcolumn = function (strTableName_a, objFieldDef_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbcreatetable = function (objTableDef_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbdropcolumn = function (strTableName_a, strFieldName_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbdroptable = function (strTableName_a, objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};

	// import/export
	this.dbexportdataset = function (objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
	this.dbimportdataset = function (objOptions_a, cbSuccess_a, cbError_a)
	{
		cbError_a();
	};
}

// methods:	createTableDef, getDatabase
function idb(os)
{
	var m_objIDB = this;
	m_arrDatabases = [
		{
			databasename : 'imdb',
			connection : '',
			readonly : true
		}
	];

	// the only inbuilt provider is localStorage
	function localStorageProvider(objIDB_a, objOptions_a)
	{
		var m_objIDB = objIDB_a;
		var m_blnReadonly = false;
		if (objOptions_a.readonly !== undefined)
		{
			m_blnReadonly = objOptions_a.readonly;
		}

		var m_arrFullCapabilities = ['read', 'write']; // todo: should reflect how this is exposed within our API

		// read
		this.dbclose = function (cbSuccess_a, cbError_a)
		{
			cbSuccess_a();
		};
		this.dbgetcapabilities = function ()
		{
			return m_arrFullCapabilities;
		};
		this.dbopen = function (cbSuccess_a, cbError_a)
		{
			cbSuccess_a();
		};
		this.dbisreadonly = function ()
		{
			return m_blnReadonly;
		};
		this.dbreadtabledef = function (strTableName_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbreadtablelist = function (cbSuccess_a, cbError_a)  {}; // todo
		this.dbselect = function (strTableName_a, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo

		// write
		this.dbdelete = function (strTableName_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbinsert = function (strTableName_a, objFieldset_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbinsertdataset = function (strTableName_a, objDataset_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbtruncatetable = function (strTableName_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbupdate = function (strTableName_a, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo

		// ddl
		this.dbaddcolumn = function (strTableName_a, objFieldDef_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbcreatetable = function (objTableDef_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbdropcolumn = function (strTableName_a, strFieldName_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo
		this.dbdroptable = function (strTableName_a, objOptions_a, cbSuccess_a, cbError_a)  {}; // todo

		// import/export
		this.dbexportdataset = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			cbError_a();
		};
		this.dbimportdataset = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			cbError_a();
		};
	}

	// options: alias, readonly, tablename
	// methods: addColumn, dropColumn, execDelete, execInsert, execInsertDataset, execUpdate, isReadonly, select, truncate
	//			getAlias, getName, getTableDef
	function table(objOptions_a, objProvider_a, objTableDef_a)
	{
		var m_objThis = this;
		var m_objProvider = objProvider_a;
		var m_objTableDef = objTableDef_a;

		var m_objOptions =
		{
			alias : '',
			readonly : true,
			tablename : ''
		};

		m_objOptions.alias = objOptions_a.alias;
		m_objOptions.tablename = objOptions_a.tablename;
		m_objOptions.readonly = objOptions_a.readonly;

		if (m_objOptions.alias === undefined)
		{
			m_objOptions.alias = m_objOptions.tablename;
		}
		if (m_objOptions.readonly === undefined)
		{
			m_objOptions.readonly = true;
		}

		// within it's own database (remember to flush the tabledef from the db afterwards)
		this.addColumn = function (objFieldDef_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbaddcolumn(m_objOptions.tablename, objFieldDef_a, cbSuccess_a, cbError_a);
			}
		};

		// within it's own database (remember to flush the tabledef from the db afterwards)
		this.dropColumn = function (strFieldName_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbdropcolumn(m_objOptions.tablename, strFieldName_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.getAlias = function ()
		{
			return m_objOptions.alias;
		};

		this.getName = function ()
		{
			return m_objOptions.tablename;
		};

		this.getTableDef = function ()
		{
			return m_objTableDef;
		};

		this.execDelete = function (strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbdelete(m_objOptions.tablename, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.execInsert = function (objFieldset_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbinsert(m_objOptions.tablename, objFieldset_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.execInsertDataset = function (arrDataset_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbinsertdataset(m_objOptions.tablename, arrDataset_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.execUpdate = function (objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbupdate(m_objOptions.tablename, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.isReadonly = function ()
		{
			return m_objOptions.readonly;
		};

		this.select = function (objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			m_objProvider.dbselect(m_objOptions.tablename, objFieldset_a, strWhere_a, objWhere_a, objOptions_a, cbSuccess_a, cbError_a);
		};

		// within it's own database
		this.truncate = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbtruncatetable(m_objOptions.tablename, objOptions_a, cbSuccess_a, cbError_a);
			}
		};
	}

	// tabledef fielddefs know their datatype
	// methods: addColumn, dropColumn
	//			getFieldDefs, getName
	function tableDef(strName_a, arrFieldDefs_a)
	{
		var m_objThis = this;
		var m_strName = strName_a;
		var m_arrFieldDefs = arrFieldDefs_a;

		// not within any database
		this.addColumn = function (objFieldDef_a)
		{
			var blnResult = false;

			try
			{
				m_arrFieldDefs.push(objFieldDef_a);
				blnResult = true;
			}
			catch (err)
			{
				blnResult = false;
			}

			return blnResult;
		};

		// not within any database
		this.dropColumn = function (strFieldName_a, objOptions_a)
		{
			var blnResult = false;

			try
			{
				processArray(m_arrFieldDefs, function (objFieldDef_a)
				{
					if (objFieldDef_a.fieldname == strFieldName_a)
					{
						delete m_arrFieldDefs[objFieldDef_a];
					}
				}
				);
				blnResult = true;
			}
			catch (err)
			{
				blnResult = false;
			}

			return blnResult;
		};

		this.getFieldDefs = function ()
		{
			return m_arrFieldDefs;
		};

		this.getName = function ()
		{
			return m_strName;
		};
	}

	// options: alias, connection, databasename, provider, readonly
	// methods: close, createTable, dropTable, exportDataset, flushTableDef, hasCapability, importDataset, isReadonly, open
	//			getAlias, getCapabilities, getName, getTable, getTableDef, getTableDefs, getTableList
	function database(objOptions_a)
	{
		var m_objThis = this;
		var m_objOptions =
		{
			alias : '',
			connection : '',
			databasename : '',
			provider : '',
			readonly : true
		};

		m_objOptions.alias = objOptions_a.alias;
		m_objOptions.connection = objOptions_a.connection;
		m_objOptions.provider = objOptions_a.provider;
		m_objOptions.readonly = objOptions_a.readonly;

		if (m_objOptions.alias === undefined)
		{
			m_objOptions.alias = m_objOptions.databasename;
		}
		if (m_objOptions.readonly === undefined)
		{
			m_objOptions.readonly = true;
		}

		var m_objProvider;
		if (m_objOptions.provider === undefined)
		{
			m_objProvider = new localStorageProvider(m_objIDB, m_objOptions);
		}
		else
		{
			// doesnt work in jsfiddle so use eval in jsfiddle
			// m_objProvider = window[m_objOptions.provider](m_objIDB, m_objOptions);
			eval('m_objProvider = new ' + m_objOptions.provider + '(m_objIDB, m_objOptions);');
		}

		var m_blnOpened = false;
		var m_arrTableDefs = [];
		var m_arrCapabilities = m_objProvider.dbgetcapabilities();

		function findTableDef(strTableName_a, cbSuccess_a, cbError_a)
		{
			var objResult;

			if (m_blnOpened)
			{
				// find our cached tabledef
				processArray(m_arrTableDefs, function (objTableDef_a)
				{
					if (objTableDef_a.getName() == strTableName_a)
					{
						objResult = objTableDef_a;
					}
				}
				);

				if (objResult === undefined)
				{
					// if not found read it
					m_objProvider.dbreadtabledef(strTableName_a, function (objResult_a)
					{
						if (objResult_a === undefined)
						{
							cbError_a();
						}
						else
						{
							// and cache it
							m_arrTableDefs.push(objResult_a);
							cbSuccess_a(objResult_a);
						}
					}, cbError_a);
				}
				else
				{
					cbSuccess_a(objResult);
				}
			}
			else
			{
				cbError_a();
			}
		}

		this.close = function (cbSuccess_a, cbError_a)
		{
			if (m_blnOpened)
			{
				m_objProvider.dbclose(function ()
				{
					m_blnOpened = false;
					cbSuccess_a();
				}, cbError_a);
			}
			else
			{
				cbError_a();
			}
		};

		// within this database but the tabledef could have come from another
		this.createTable = function (objTableDef_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbcreatetable(objTableDef_a, cbSuccess_a, cbError_a);
			}
		};

		// within this database
		this.dropTable = function (strTableName_a, objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbdroptable(strTableName_a, objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		// within this database
		this.exportDataset = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			m_objProvider.dbexportdataset(objOptions_a, cbSuccess_a, cbError_a);
		};

		// flushes the tabledef from cache
		this.flushTableDef = function (strTableName_a)
		{
			processArray(m_arrTableDefs, function (objTableDef_a)
			{
				if (objTableDef_a.getName() == strTableName_a)
				{
					delete m_arrTableDefs[objTableDef_a];
				}
			}
			);
		};

		this.getAlias = function ()
		{
			return m_objOptions.alias;
		};

		this.getCapabilities = function ()
		{
			return m_arrCapabilities;
		};

		this.getName = function ()
		{
			return m_objOptions.databasename;
		};

		this.getTable = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			findTableDef(objOptions_a.tablename, function (objTableDef_a)
			{
				// if the db is readonly then the table is
				if (m_objOptions.readonly)
				{
					objOptions_a.readonly = true;
				}

				cbSuccess_a(new table(objOptions_a, m_objProvider, objTableDef_a));
			}, cbError_a);
		};

		this.getTableDef = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			findTableDef(objOptions_a.tablename, cbSuccess_a, cbError_a);
		};

		// handles sequencial loading of asynchronous stuff
		this.getTableDefs = function (cbSuccess_a, cbError_a)
		{
			var objResult = [];

			m_objProvider.dbreadtablelist(function (arrTableList_a)
			{
				if (arrTableList_a.length === 0)
				{
					cbSuccess_a(objResult);
				}
				else
				{
					function fetchTableDef(strTableName_a, cbNext_a, cbError_a)
					{
						findTableDef(strTableName_a, function (objTableDef_a)
						{
							objResult.push(objTableDef_a);
							cbNext_a();
						}, cbError_a);
					}

					function doNext()
					{
						if (arrTableList_a.length > 0)
						{
							var strTableName = arrTableList_a.shift();
							fetchTableDef(strTableName, doNext, cbError_a);
						}
						else
						{
							cbSuccess_a(objResult);
						}
					}

					doNext();
				}
			}, cbError_a);
		};

		this.getTableList = function (cbSuccess_a, cbError_a)
		{
			m_objProvider.dbreadtablelist(cbSuccess_a, cbError_a);
		};

		this.hasCapability = function (strCapability_a)
		{
			var blnResult = false;

			processArray(m_arrCapabilities, function (strToCheck_a)
			{
				if (strToCheck_a == strCapability_a)
				{
					blnResult = true;
				}
			}
			);

			return blnResult;
		};

		// within this database
		this.importDataset = function (objOptions_a, cbSuccess_a, cbError_a)
		{
			if (m_objOptions.readonly)
			{
				cbError_a();
			}
			else
			{
				m_objProvider.dbimportdataset(objOptions_a, cbSuccess_a, cbError_a);
			}
		};

		this.isReadonly = function ()
		{
			return m_objOptions.readonly;
		};

		this.open = function (cbSuccess_a, cbError_a)
		{
			if (!m_blnOpened)
			{
				m_objProvider.dbopen(function ()
				{
					m_blnOpened = true;
					if (m_objProvider.dbisreadonly())
					{
						// if our underlying db is readonly, then regardless of what we want, we are readonly
						m_objOptions.readonly = true;
					}
					cbSuccess_a();
				}, cbError_a);
			}
			else
			{
				cbError_a();
			}
		};
	}

	this.getDatabase = function (objOptions_a)
	{
		return new database(objOptions_a);
	};

	this.createTableDef = function (strName_a, arrFieldDefs_a)
	{
		return new tableDef(strName_a, arrFieldDefs_a);
	};
}