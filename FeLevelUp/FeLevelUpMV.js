//=============================================================================
// ASYUN_LevelUpWithRandom.js
// ----------------------------------------------------------------------------
// (C) 2020 えーしゅん
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2020/11/02 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://taikai-kobo.hatenablog.com
// [Twitter]: https://twitter.com/Asyun3i9t
// [GitHub] : https://github.com/HidetoshiKawaguchi/RPGMaker-plugins
//=============================================================================
//
/*:
 * @plugindesc ファイアーエムブレム風レベルアッププラグイン(MV版)
 * @author えーしゅん
 *
 * @param DisplayLevelUp
 * @text レベルアップ時表示ON/OFF
 * @desc レベルアップ時の表示のON/OFFを切り替えます。
 *(-1: 非表示, 0:表示, 1以上:スイッチ番号)
 * @default 0
 * @type string
 *
 * @param TemplateDisplayLevelUp
 * @text 表示テンプレート
 * @desc レベルアップ時のパラメータアップ表示テンプレート
 *(%1:パラメータ名,%2:アップ前,%3:アップ後,%4:アップ値)
 * @default %1: %2 -> %3 (+%4)
 * @type string
 *
 * @help FeLevelUpMV.js [ファイアーエムブレム風レベルアッププラグイン(MV版)]
 *
 * このプラグインはファイアーエムブレム風のレベルアップ機能を実現します。
 * アクター毎に設定した成長率(確率)に応じて、レベルアップ時にランダムに
 * パラメータがアップするようになります。
 *
 * ## 使い方
 * アクター毎にパラメータの初期値と成長率を設定する必要があります。
 * オプションとして、職業・武器・防具にも成長率を設定できます。
 * その場合、アクターに設定した成長率に補正を加えることになります。
 *
 * ### アクターのパラメータの初期値を設定する(必須)
 * アクターのパラメータの初期値は、アクターのメモ欄に以下のように
 * 記述してください。
 * ```
 * <FE_INIT_PARAMS: 最大HP, 最大MP, 攻撃力, 防御力, 魔法力, 魔法防御, 敏捷性, 運>
 * ```
 * カンマ区切りで、数値を記入してください。
 * `FE_INIT_PARAMETERS`は`FE_初期パラメータ`でも代用できます。
 *
 * 例えば、以下のように書きます。
 * ```
 * <FE_INIT_PARAMS: 20, 12, 9, 5, 7, 2, 1, 8, 6>
 * ```
 * これで、このアクターのパラメータの初期値は最大HPが20, 最大MPが12,
 * 攻撃力が9, 防御力が5, 魔法力が7, 魔法防御が1, 敏捷性が8, 運が6になります。
 *
 * ### アクター毎に成長率を設定する(必須)
 * アクターの成長率(確率)は、アクターのメモ欄に以下のように記述してください。
 * ```
 * <FE_GROWTH_RATES: 最大HP, 最大MP, 攻撃力, 防御力, 魔法力, 魔法防御, 敏捷性, 運>
 * ```
 * カンマ区切りで、数値を記入してください。
 * `FE_GROWTH_RATES`は`FE_成長率`でも代用できます。
 * 例えば、以下のように書きます。
 * ```
 * <FE_GROWTH_RATES: 60, 20, 50, 55, 15, 10, 40, 30>
 * ```
 * これで、このアクターはレベルアップ時に60%の確率で最大HPが1上がります。
 * 最大MPは20%, 攻撃力は50%, 防御力は55%, 魔法力は15%, 魔法防御は10%,
 * 敏捷性は40%, 運は30%の確率で1上がります。
 *
 * 100以上を設定した場合は、その値÷100の値の整数分の値が必ず上がります。
 * そして、あまりの確率で1上がるかの判定を行います。
 * 例えば、230と設定した場合は、必ず2は上がり、更に30%の確率で1上がります。
 *
 * ### 職業・武器・防具に成長率の補正を設定する
 * 職業・武器・防具にアクターの成長率への補正を設定することができます。
 * 記法はアクター毎の成長率と同じです。
 * マイナスの値を設定して、成長率を低下させることもできます。
 * 例えば、職業のメモ欄に以下のように設定すると、攻撃力の成長率が10%上がり、
 * 敏捷性の成長率が5%下がります。
 * ```
 * <FE_GROWTH_RATES: 0, 0, 10, 0, 0, 0, -5, 0>
 * ```
 *
 * ### アクターのパラメータを初期化する
 * 以下のプラグインコマンドを実行することにより、指定したアクターのパラメータを
 * 初期化することができます。
 * ```
 * FE_INITIALIZE_PARAMS <アクターID>
 * ```
 * `FE_INITIALIZE_PARAMS`は`FE_パラメータ初期化でも代替できます。
 *
 * 例えば、以下のように書くとID1のアクターのパラメータを初期化することが
 * できます。
 * ```
 * FE_INITIALIZE_PARAMS 1
 * ```
 *
 * このプラグインコマンドだけではレベルは下がらないので、
 * 必要に応じてツクールのイベントコマンド等で下げてください。
 *
 *
 * ## 連絡先/Author
 * えーしゅん
 * - Twitter:  https://twitter.com/Asyun3i9t
 * - ホームページ: taikai-kobo.hatenablog.com
 *
 * ## 利用規約
 * 作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）についても
 * 制限はありません。このプラグインはもうあなたのものです。
 */
(function() {
    'use strict'
    const prefix = 'FE_'
    //=============================================================================
    // パラメータの取得と整形
    //=============================================================================
    var createPluginParameter = function(pluginName) {
        var replacer = function(key, value) {
            if (value === 'null') {
                return value;
            }
            if (value[0] === '"' && value[value.length - 1] === '"') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        };
        var pMP = PluginManager.parameters(pluginName)
        var parameters = JSON.parse(JSON.stringify(pMP, replacer));
        // PluginManager.setParameters(pluginName, parameters);
        return parameters;
    };
    const params = createPluginParameter('FeLevelUpMV');

    //=============================================================================
    // 汎用処理関数を定義
    //=============================================================================
    function addArray(array1, array2) {
        var out = [];
        for(var i=0; i < array1.length; i++) {
            var v = array2[i] ? array2[i] : 0;
            out.push(array1[i] + v);
        }
        return out;
    }

    function checkParams(params) {
        if (params.length != 8) {
            return false;
        }
        for (const p of params) {
            if (typeof(p) != 'number') {
                return false;
            }
        }
        return true;
    }

    function parseGrowthRates(meta) {
        var enKey = prefix + 'GROWTH_RATES';
        var jaKey = prefix + '成長率'
        var strGrowthRates = meta[enKey];
        if (strGrowthRates == undefined) {
            strGrowthRates = meta[jaKey] ? meta[jaKey] : '';
        }
        var growthRates = strGrowthRates.split(',').map(p => Number(p));
        growthRates = checkParams(growthRates) ? growthRates : new Array(8).fill(0);
        return growthRates;
    }

    //=============================================================================
    //  プラグインコマンドの追加
    //=============================================================================
    var pluginCommandMap = new Map();
    pluginCommandMap.set(prefix + 'パラメータ初期化', 'callInitializeParams');
    pluginCommandMap.set(prefix + 'INITIALIZE_PARAMS', 'callInitializeParams');
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        var pluginCommandMethod = pluginCommandMap.get(command.toUpperCase());
        if (pluginCommandMethod) {
            var actorId = Number(args[0]);
            this[pluginCommandMethod](actorId);
        }
    };
    Game_Interpreter.prototype.callInitializeParams = function(actorId) {
        var actor = $gameActors.actor(actorId);
        if(actor) {
            actor.initializeParams();
        }
    };

    //=============================================================================
    // レベルアップ時の判定・上昇値の計算をする処理
    //=============================================================================
    Game_Actor.prototype.initializeParams = function() {
        var meta = $dataActors[this.actorId()].meta;
        var enKey = prefix + 'INIT_PARAMS'
        var jaKey = prefix + '初期パラメータ'
        if (meta[enKey] || meta[jaKey]) {
            var strParams = meta[enKey];
            if (strParams == undefined) {
                strParams = meta[jaKey] ? meta[jaKey] : ''
            }
            var params = strParams.split(',').map(p => Number(p));
            params = checkParams(params) ? params : [1, 0, 1, 1, 1, 1, 1, 1];
            this._feParams = params;
        }  // 初期パラメータが設定されていなければ何もしない
    };

    Game_Actor.prototype.growthRates = function() {
        var meta = $dataActors[this.actorId()].meta;
        var baseGrowth = parseGrowthRates(meta);
        var classGrowth = parseGrowthRates(this.currentClass().meta);
        var weaponGrowthList = this.weapons().map(w => parseGrowthRates(w.meta));
        var armorGrowthList = this.armors().map(a => parseGrowthRates(a.meta));

        var growthRates = addArray(baseGrowth, classGrowth);
        growthRates = weaponGrowthList.reduce(addArray, growthRates);
        growthRates = armorGrowthList.reduce(addArray, growthRates);
        growthRates = growthRates.map(g => Math.max(g, 0));
        return growthRates;
    };

    var _Game_Actor_ParamBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        if (this._feParams == undefined) {
            this.initializeParams();
        }
        if (this._feParams) {
            if (this._feParams[paramId]) {
                return this._feParams[paramId];
            }
        }
        return _Game_Actor_ParamBase.apply(this, arguments);
    };

    var _Game_Actor_LevelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        if(this._level == 1) this.initializeParams();
        _Game_Actor_LevelUp.apply(this, arguments);
        var meta = $dataActors[this.actorId()].meta;
        var enKey = prefix + 'GROWTH_RATES';
        var jaKey = prefix + '成長率'
        if ((enKey || jaKey)&& this._feParams) {
            var growth = this.growthRates();
            // 判定と反映
            for (var i=0; i < this._feParams.length; i++) {
                this._feParams[i] += Math.max(Math.floor(growth[i] / 100), 0);
                if (Math.randomInt(100) < (growth[i] % 100)) {
                    this._feParams[i] += 1;
                }
            }
        }
    };

    //=============================================================================
    // レベルアップ時の表示に関する処理(簡易)
    //=============================================================================
    Game_Actor.prototype.displayFeParamsUp = function(prevFeParams, nextFeParams) {
        var template = params.TemplateDisplayLevelUp;
        for (let i=0; i < prevFeParams.length; i++) {
            let prev = prevFeParams[i];
            let next = nextFeParams[i];
            let diff = next - prev;
            if (diff != 0) {
                let name = $dataSystem.terms.params[i];
                let text = template.format(name, prev, next, diff);
                $gameMessage.add(text);
            }
        }
    }

    var _Game_Actor_ChangeExp = Game_Actor.prototype.changeExp;
    Game_Actor.prototype.changeExp = function(exp, show) {
        if (params.DisplayLevelUp < 0) {
            var display = false;
        } else if (params.DisplayLevelUp === 0) {
            var display = true;
        } else {
            var display = $gameVariables.value(params.DisplayLevelUp);
        }
        if (display && this._feParams != undefined) { // 設定されていない場合
            var prevFeParams = this._feParams.map(p => p);
            _Game_Actor_ChangeExp.apply(this, arguments);
            var nextFeParams = this._feParams.map(p => p);
            if (show) {
                this.displayFeParamsUp(prevFeParams, nextFeParams);
            }
        }
        else {
            _Game_Actor_ChangeExp.apply(this, arguments);
        }
    };
})();
