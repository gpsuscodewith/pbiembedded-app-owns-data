package com.gpsuscodewith.powerbiembedded.appownsdata.commands;

public class PowerBiRestCommandResult<T> {
    private boolean isSuccessful;
    private T resultBody;

    public PowerBiRestCommandResult()  {
        this(false, null);
    }
    public PowerBiRestCommandResult(boolean isSuccessful, T resultBody) {
        this.isSuccessful = isSuccessful;
        this.resultBody = resultBody;
    }

}
