package com.gpsuscodewith.powerbiembedded.appownsdata.powerbi.commands;

public interface Executor<Req, Res> {
    Res exeute(Req command);
}
