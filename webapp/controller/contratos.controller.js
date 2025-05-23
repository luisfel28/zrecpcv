sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
],
function (Controller, MessageToast) {
    "use strict";

    var oFilters            = [],
        oFilterCompany      = [],
        oFilterContRes      = [];        

    return Controller.extend("fidelidademundial.com.zrecpcv.controller.contratos", {
        
        onInit: function () {
            $.sap.gTabCont = this.getView().byId("TabCont");
            $.sap.gConfirmation = this.getView().byId("MsgConfirmation");

            var vImage = this.getView().byId("imgLogo");
            var UrlAmbiente = window.location.href.split("/")[2]
            vImage.setProperty("src", "https://"+UrlAmbiente+"/sap/bc/ui5_ui5/sap/zre_cpcv/img/logo_fid_app.jpg");

        },

        handleContract: function (evt) {

            // Empresa
            var vBUKRS = evt.getSource().getBindingContext().getObject("bukrs");

            // Contrato
            var vCONT;
            vCONT = evt.getSource().getProperty("text").toString();

            var finalUrl = window.location.href.split("#")[0] + "#REContract-manageContract?CompanyCode="+vBUKRS+"&RealEstateContract="+vCONT+"&REContract="+vCONT+"&DynproNoFirstScreen=1";
            sap.m.URLHelper.redirect(finalUrl, false);

        },

        handleBP: function (evt) {

            // Business Partner
            var vBP = evt.getSource().getProperty("text").toString();

            var finalUrl = window.location.href.split("#")[0] + "#BusinessPartner-display?BusinessPartner="+vBP+"&sap-ach=FIN-FSCM-TRM";
            sap.m.URLHelper.redirect(finalUrl, false);

        },        

        OnSearchCont: function () {

            var vTab = this.getView().byId("TabCont");

            $.sap.gConfirmation.setProperty("visible", false);

            ///////////////////////////////////////////////////////////////////
            oFilters = [];

            /// Empresas
            for (var i = 0; i < oFilterCompany.length; i++) {
                var oTabFilter = new sap.ui.model.Filter("bukrs", sap.ui.model.FilterOperator.EQ, oFilterCompany[i].toString());
                oFilters.push(oTabFilter);
            }            

            /// Contrato Reserva
            for (var i = 0; i < oFilterContRes.length; i++) {
                var oTabFilter = new sap.ui.model.Filter("recnnr", sap.ui.model.FilterOperator.EQ, oFilterContRes[i].toString());
                oFilters.push(oTabFilter);
            }            

            /// Status
            var vRadioStatus = this.getView().byId("rbgSTATUS");
            var vStatusVal = vRadioStatus.getSelectedButton().getText();
            var oTabFilter = new sap.ui.model.Filter();

            if ( vStatusVal != "Todos" )
            {
                if ( vStatusVal == "OK" )
                { 
                    oTabFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "OK" );
                }
                else
                {   
                    oTabFilter = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "PEND" );
                }

                oFilters.push(oTabFilter);

            };            

            ///////////////////////////////////////////////////////////////////

            var oGlobalBusyDialog = new sap.m.BusyDialog();
            oGlobalBusyDialog.open();

            vTab.getBinding().filter(oFilters);

            oGlobalBusyDialog.close();

        },

        dateFormatter: function (jsonDateString) { 
            return new Date(parseInt(jsonDateString.replace('/Date(', '')));
        },

        handleCompanyChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            if (!isSelected) {
                var index = oFilterCompany.indexOf(changedItem.getText());
                oFilterCompany.splice(index, 1);
            }
            else {
                oFilterCompany.push(changedItem.getText());
            }

        },

        handleContResChange: function (oEvent) {
            var changedItem = oEvent.getParameter("changedItem");
            var isSelected = oEvent.getParameter("selected");

            if (!isSelected) {
                var index = oFilterContRes.indexOf(changedItem.getText());
                oFilterContRes.splice(index, 1);
            }
            else {
                oFilterContRes.push(changedItem.getText());
            }

        },

        onCreateCont: function (evt) {

            var vTblContratos       = this.getView().byId("TabCont"),
                vMsgConfirmation    = this.getView().byId("MsgConfirmation"),
                vRecnTxt            = "-";

            $.sap.gConfirmation.setProperty("visible", false);                

            if ( vTblContratos.getSelectedIndex() != -1 )
            {

                var vIndex = vTblContratos.getSelectedIndex();

                if ( vTblContratos.getContextByIndex(vIndex).getObject().recnnrcpcv == "" )
                {

                    var aDadosContrato = {
                        "bukrs" : vTblContratos.getContextByIndex(vIndex).getObject().bukrs,
                        "recnnr" : vTblContratos.getContextByIndex(vIndex).getObject().recnnr,
                        "partner" : vTblContratos.getContextByIndex(vIndex).getObject().partner
                    };

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
                oRouter.navTo("Routecriacao", aDadosContrato);
                }
                else 
                {
                    MessageToast.show("Contrato CPCV já criado para essa Reserva!");
                }

            }
            else
            {
                MessageToast.show("Nenhum contrato selecionado");
            }

        },

        onContTab: function () {

            var vTblContratos   = this.getView().byId("TabCont"),
                vCountRegs      = vTblContratos.getBinding("rows").getLength(),
                vTabTitle       = this.getView().byId("TabContListTitle"),
                vMsg = "Contratos (" + vCountRegs + ")";

                // Título da Tabela
                vTabTitle.setText(vMsg);

                // Ajusta Progress Indicator
                var vProgIndicator   = this.getView().byId("ProgIndicator"),
                    vLblProgresso    = this.getView().byId("lblProgresso"),
                    vCPCV   = 0;

                for (var vCont = 0; vCont < vCountRegs; vCont++ )
                {

                    if ( vTblContratos.getContextByIndex(vCont).getObject().recnnrcpcv != "" )
                    {
                        //vCPCV += 1;
                        vCPCV++;
                    }

                };

                var vPercValue = vCPCV * 100 / vCountRegs;
                vProgIndicator.setPercentValue(vPercValue);
                
                vPercValue = vPercValue.toFixed(2);
                vPercValue = vPercValue.replace(".", ",");
                var vPerctext = vPercValue + "%";
                vProgIndicator.setDisplayValue(vPerctext);

                vLblProgresso.setText("Contr. Vendas ("+vCPCV+") / Contr. Reservas ("+vCountRegs+")");

        },

    });
});
