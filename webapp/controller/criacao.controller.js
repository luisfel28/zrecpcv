sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    var Filtro      = [];
    var sBukrs      = "";
    var sRecnnr     = "";

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.criacao", {
        
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("Routecriacao").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched : function (oEvent) {

            var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZRE_GW_CPCV_SRV", true);
            
            var vObj        = "";

            sBukrs = oEvent.getParameter("arguments").bukrs;  // Empresa
            Filtro.push(new sap.ui.model.Filter("Bukrs", "EQ",sBukrs));

            sRecnnr = oEvent.getParameter("arguments").recnnr;  // Contrato Reserva
            Filtro.push(new sap.ui.model.Filter("Recnnr", "EQ",sRecnnr));

           
            oModel.read("/EntConditionsSet", {
                urlParameters: {
                    "$top": 9999
                },
                success: function (oData, oResponse) {
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

            var vLblPartner = this.getView().byId("lblPartner");
            vLblPartner.setText(oEvent.getParameter("arguments").partner);            

            oModel.read("/EntCPCVSet(Bukrs='"+sBukrs+"',Recnnr='"+sRecnnr+"')", {
                success: function (oDataCont, oResponseCont) {
                    this.WriteDataCabec(oResponseCont);
                }.bind(this),
                error: function (err) {
                    
                },
                filters: Filtro
            }
            );

        },

        WriteData: function (results) {

            var oTable      = this.getView().byId("TabConditions");
            var oModel = new sap.ui.model.json.JSONModel();

            oModel.setData(results);
            oTable.setModel(oModel);
            Filtro = [];

        },   

        WriteDataCabec: function (oresponse) {

            var vRecnTxt    = oresponse.data.Recntxt,
            vDtIni          , 
            vDtFim          ;                    

            var vLblRecnTxt = this.getView().byId("lblRecnTxt");

            /// DENOMINAÇÃO CONTRATO
            if ( vRecnTxt == "" )
            { vRecnTxt = "-" }

            vLblRecnTxt.setText(vRecnTxt);

            var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd/MM/yyyy"
            });

            /// INÍCIO CONTRATO
            var vLblDtIni = this.getView().byId("lblTitDtIni");
            vDtIni = new Date(oresponse.data.Recnbeg);

            if ( oresponse.data.Recnbeg != null )
            { 
                vLblDtIni.setText("Início Contrato (" + dateFormat.format(vDtIni)+")"); 

                var vTxtDtIni = this.getView().byId("TxtDtIni");
                vTxtDtIni.setDateValue(vDtIni);   
                vTxtDtIni.setDisplayFormat("dd/MM/yyyy"); 
            }            

               /// FIM CONTRATO                
            var vLblDtFim = this.getView().byId("lblTitDtFim");
            vDtFim = new Date(oresponse.data.Recnend1st);            

            if ( oresponse.data.Recnend1st != null )
            { 

                vLblDtFim.setText("Fim Contrato (" + dateFormat.format(vDtFim)+")");             

                var vTxtDtFim = this.getView().byId("TxtDtFim");
                vTxtDtFim.setDateValue(vDtFim);                        
                vTxtDtFim.setDisplayFormat("dd/MM/yyyy");     

            }

        },   

        onCreateContCPCV: function () {

            var oModel  = this.getView().getModel();

            var vTabConditions = this.getView().byId("TabConditions");
            
            var vTxtDtIni = this.getView().byId("TxtDtIni");
            var vTxtDtFim = this.getView().byId("TxtDtFim");

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
                    "Condvalidfrom" :  vTabConditions.getContextByIndex(vCont).getObject().Condvalidfromcpcv,
                    "Condpurposeext" :  vTabConditions.getContextByIndex(vCont).getObject().Condpurposeextcpcv
                };
                oConditionsCPCV.push(aDadosConditions);

            }

            var vDtIni = new Date(vTxtDtIni.getDateValue());
            //vDtIni.setDate(vDtIni.getDate() + 1);
            
            var vDtFim = new Date(vTxtDtFim.getDateValue());               
            //vDtFim.setDate(vDtFim.getDate() + 1);

            // DADOS CONTRATO CPCV
            var aDadosContrato = {
                "Bukrs" : sBukrs,
                "Recnnr" :  sRecnnr,
                "Recnbeg" : vDtIni,
                "Recnend1st" : vDtFim,
                "EntConditionsSet" : oConditionsCPCV
            };

            oContratoCPCV.push(aDadosContrato);
                
            oModel.create("/EntCPCVSet", aDadosContrato, {
                success: function (odata, oResponse) {

                    var vBukrsContVenda     = oResponse.data.Bukrs;
                    var vRecnnrContVenda    = oResponse.data.Recnnr;

                    if ( vRecnnrContVenda != "" )
                    {
                    var mSuc = "Contrato de venda " + vBukrsContVenda + "/" + vRecnnrContVenda + " criado com sucesso!";

                    sap.ui.getCore().AppContext.gTabCont.getBinding("rows").refresh();

                    sap.ui.getCore().AppContext.gConfirmation.setText(mSuc);
                    sap.ui.getCore().AppContext.gConfirmation.setProperty("visible", true);

                    oRouter.navTo("Routecontratos");               
                    }
                    else
                    {
                        MessageToast.show("Erro na criação do contrato. Verifique as informações!");    
                    }

                },
                error: function (oError) {
                    MessageToast.show(oError.responseText);
                }
            } );             

            
                 

        }

    });
});
