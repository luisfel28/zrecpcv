sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    var Filtro = [];
    var sBukrs = "";
    var sRecnnr = "";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.criacao", {
        
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("Routecriacao").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched : function (oEvent) {

            var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRE_GW_CPCV_SRV", true);
            var vObj = "";

            sBukrs = oEvent.getParameter("arguments").bukrs;  // Empresa
            Filtro.push(new sap.ui.model.Filter("Bukrs", "EQ",sBukrs));

            sRecnnr = oEvent.getParameter("arguments").recnnr;  // Contrato Reserva
            Filtro.push(new sap.ui.model.Filter("Recnnr", "EQ",sRecnnr));

            oModel.read("/EntConditionsSet", {
                urlParameters: {
                    "$top": 9999
                },
                success: function (oData, response) {
                    this.WriteData(oData);
                }.bind(this),
                error: function (err) {
                    
                },
                filters: Filtro
            }
            );
            
            var vLblBukrs = this.getView().byId("lblBukrs");
            vLblBukrs.setText(sBukrs);

            var vLblRecnnr = this.getView().byId("lblRecnnr");
            vLblRecnnr.setText(sRecnnr);

        },

        WriteData: function (results) {

            var oTable      = this.getView().byId("TabConditions");
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(results);
            oTable.setModel(oModel);
            Filtro = [];

        },   

        onCreateContCPCV: function () {

            var oModel  = this.getView().getModel();

            var vTabConditions = this.getView().byId("TabConditions");

            var oContratoCPCV       = [],
                oConditionsCPCV     = [];

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);                 

            for (var vCont = 0; vCont < vTabConditions._iBindingLength; vCont++ )
            {
                               
                // CONDIÇÕES CONTRATO CPCV
                var aDadosConditions = {
                    "Bukrs" : vTabConditions.getContextByIndex(vCont).getObject().Bukrs,
                    "Recnnr" :  vTabConditions.getContextByIndex(vCont).getObject().Recnnr,
                    "Condtype" :  vTabConditions.getContextByIndex(vCont).getObject().Condtype, 
                    "Condvalidfrom" :  vTabConditions.getContextByIndex(vCont).getObject().Condvalidfrom,
                    "Condpurposeext" :  vTabConditions.getContextByIndex(vCont).getObject().Condpurposeext
                };
                oConditionsCPCV.push(aDadosConditions);

            }

            // DADOS CONTRATO CPCV
            var aDadosContrato = {
                "Bukrs" : sBukrs,
                "Recnnr" :  sRecnnr,
                "EntConditionsSet" : oConditionsCPCV
            };

            oContratoCPCV.push(aDadosContrato);
                
            oModel.create("/EntCPCVSet", aDadosContrato, {
                success: function (odata, oResponse) {

                    var vBukrsContVenda     = oResponse.data.Bukrs;
                    var vRecnnrContVenda    = oResponse.data.Recnnr;

                     var mSuc = "Contrato de venda " + vBukrsContVenda + "/" + vRecnnrContVenda + " criado com sucesso!";
/*                    MessageToast.show(mSuc,{
                        duration: 5000, 
                        width: "20rem", // default max width supported 
                    }); */

                    sap.ui.getCore().AppContext.gTabCont.getBinding("rows").refresh();

                    //gConfirmation.setType("Error");
                    sap.ui.getCore().AppContext.gConfirmation.setText(mSuc);
                    sap.ui.getCore().AppContext.gConfirmation.setProperty("visible", true);

                    oRouter.navTo("Routecontratos");               

                },
                error: function (oError) {
                    MessageToast.show(oError.responseText);
                }
            } );             

            
                 

        }

    });
});
